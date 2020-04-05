import { RemoteMongoClient, Stitch, AnonymousCredential, BSON } from 'mongodb-stitch-browser-sdk'
import { yobs_counter } from '../pipelines/jobs'

import { 
    suggestions_history,
    heat_map_aggregate,
    industry_counter,
    likes_counter,
    tech_counter,
    salary_array,
    kanban_array,
    map_yobIds
} from '../pipelines/suggestions'



const client = Stitch.initializeDefaultAppClient('yobs-wqucd')
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('Yobs')

const usersDB = db.collection('devUsers')
const yobsDB = db.collection('devYobs')
const suggestionsDB = db.collection('devSuggestions')


//User Requests
export const get_user = async () => {
    const { id: user_id } = await client.auth.loginWithCredential(new AnonymousCredential())
    const user = await usersDB.findOne({ UserID: user_id }).catch(console.log)

    if(!user){
        const inital_location = [Math.random()*100, Math.random()*100]
        const new_user = { UserID: user_id, MLocation: inital_location}
        await usersDB.insertOne(new_user).catch(s => console.log('User Error', s))
        return new_user
    } else { return user }
}


// Suggestion Requests
export const get_suggestions = async user => {
    const suggestions = await client.callFunction('getSuggestions', [user])

    if(!suggestions.length){
        const { yobIds } = (await suggestionsDB.aggregate(map_yobIds(user.UserID)).toArray())[0] || { yobIds: []}
        const new_suggestions = await client.callFunction('suggest', [user.MLocation])
        return [...suggestions, ...new_suggestions.filter(({ JobId }) => !yobIds.includes(JobId))]
    } else { return suggestions }
}


export const save_suggestions = async user => {
    const { yobIds } = (await suggestionsDB.aggregate(map_yobIds(user.UserID)).toArray())[0]
    const suggestions = await client.callFunction('suggest', [user.MLocation])
    const filtered_suggestions = suggestions.filter(({ JobId }) => !yobIds.includes(JobId)).filter((_, idx) => idx < 20)

    const user_props = { UserID: user.UserID, User_MLocation: user.MLocation }
    const suggestion_props = { Liked: null, Staged: 'Suggested', Open: null, Applied: false }
    const suggestion_documents = filtered_suggestions.map(s => ({...s, ...user_props, ...suggestion_props}))
    console.log('Saving')
    const saved_suggestions = await suggestionsDB.insertMany(suggestion_documents).toArray().catch(console.log)

    return saved_suggestions
}


export const get_suggestion_history = async user_id => {
    const suggestions = await suggestionsDB.aggregate(suggestions_history(user_id)).toArray().catch(console.log)
    return {
        liked: suggestions.filter(({ Liked }) => Liked),
        rejected: suggestions.filter(({ Liked }) => !Liked)
    }
}


// Kanban Requests
export const get_kanban_yobs = async user_id => await suggestionsDB.aggregate(kanban_array(user_id)).toArray().catch(console.log)


// Dashboard Requets
export const get_counters = async user_id => {
    const total_yobs = await yobsDB.aggregate(yobs_counter).toArray()
    const like_metrics = await suggestionsDB.aggregate(likes_counter(user_id)).toArray()

    return {
        total: total_yobs[0].count,
        liked: (like_metrics.find(({_id}) => _id === true) || {count: 0}).count,
        rejected: (like_metrics.find(({_id}) => _id === false) || {count: 0}).count
    }
}


export const get_dashboard_metrics = async user_id => {
    const tech_stack = await suggestionsDB.aggregate(tech_counter(user_id)).toArray()
    const industries = await suggestionsDB.aggregate(industry_counter(user_id)).toArray()
    const location_likes = await suggestionsDB.aggregate(heat_map_aggregate(user_id)).toArray()
    const salary_distribution = await suggestionsDB.aggregate(salary_array(user_id)).toArray()

    return {
        tech: tech_stack,
        industries: industries,
        locations: (location_likes[0] || {}).locations,
        salaries: (salary_distribution[0] || {}).count
    }
}


// Mutations
export const edit_user = ({_id, ...doc}) => usersDB.updateOne(
    { _id: new BSON.ObjectID(_id)}, { $set: doc }, { upsert: true }
).catch(console.log)


export const edit_suggestion = ({_id, ...doc}) => suggestionsDB.updateOne(
    { _id: new BSON.ObjectID(_id)}, { $set: doc }, { upsert: true }
).catch(console.log)


export const apply_to_suggestion = ({_id, ...doc}) => suggestionsDB.updateOne(
    { _id: new BSON.ObjectID(_id)}, {$set: {...doc, Applied: true}}, {upsert: true}
).catch(console.log)

export const close_suggestion = ({_id, ...doc}) => suggestionsDB.updateOne(
    { _id: new BSON.ObjectID(_id)}, {$set: {...doc, Applied: false}}, {upsert: true}
).catch(console.log)
