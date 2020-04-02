import { 
    get_ranked_cached_suggestions,
    suggestions_history,
    heat_map_aggregate,
    industry_counter,
    likes_counter,
    tech_counter,
    salary_array,
    map_yobIds
} from './pipelines/suggestions'

import {
    yobs_counter,
    suggest
} from './pipelines/jobs'



import { RemoteMongoClient, Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'


const client = Stitch.initializeDefaultAppClient('yobs-wqucd')
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')

const usersDB = db.collection('devUsers')
const yobsDB = db.collection('devYobs')
const suggestionsDB = db.collection('devSuggestions')


export const get_user = async () => {
    const { id: user_id } = await client.auth.loginWithCredential(new AnonymousCredential())
    const user = await usersDB.findOne({ UserID: user_id }).asArray().catch(console.log)

    if(!user){
        const inital_location = [Math.random()*100, Math.random()*100]
        const new_user = { UserID: user_id, MLocation: inital_location}
        await usersDB.insertOne(new_user).catch(console.log)
        return new_user
    } else { return user }
}


export const get_suggestions = async user => {
    const suggestions = await suggestionsDB.aggregate(get_ranked_cached_suggestions(user)).toArray()
    if(!suggestions.length){
        const { yobIds } = (await suggestionsDB.aggregate(map_yobIds(user.UserID)).toArray())[0]
        const new_suggestions = await yobsDB.aggregate(suggest(user.MLocation)).toArray()
        return [...suggestions, ...new_suggestions.filter(({ JobId }) => !yobIds.includes(JobId))]        
    } else { return suggestions }
}


export const save_suggestions = async user => {
    const { yobIds } = (await suggestionsDB.aggregate(map_yobIds(user.UserID)).toArray())[0]
    const suggestions = await yobsDB.aggregate(suggest(user.MLocation)).toArray()
    const filtered_suggestions = suggestions.filter(({ JobId }) => !yobIds.includes(JobId)).filter((_, idx) => idx < 20)

    const extended_yob_props = { UserID: user.UserID, User_MLocation: user.MLocation, Liked: null, Staged: 'Suggested', Open: null }
    const suggestion_documents = filtered_suggestions.map(s => ({...s, ...extended_yob_props}))
    const saved_suggestions = await suggestionsDB.insertMany(suggestion_documents).toArray().catch(console.log)

    return saved_suggestions
}



export const get_counters = async user_id => {
    const total_yobs = await yobsDB.aggregate(yobs_counter).toArray()
    const like_metrics = await suggestionsDB.aggregate(likes_counter(user_id)).toArray()

    return {
        total: total_yobs[0].count,
        liked: (like_metrics.find(({_id}) => _id === true) || {count: 0}).count,
        rejected: (like_metrics.find(({_id}) => _id === false) || {count: 0}).count
    }
}


export const get_suggestion_history = async user_id => {
    const suggestions = await suggestionsDB.aggregate(suggestions_history(user_id)).toArray()
    return {
        liked: suggestions.filter(({ Liked }) => Liked),
        rejected: suggestions.filter(({ Liked }) => !Liked)
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
        locations: location_likes,
        salaries: salary_distribution
    }
}


const edit_body = ({_id, ...doc}) => ({ _id: new BSON.ObjectID(_id)}, {$set: doc}, {upsert: true})
export const edit_user = doc => usersDB.updateOne(edit_body(doc)).catch(console.log)
export const edit_suggestion = doc => suggestionsDB.updateOne(edit_body(doc)).catch(console.log)
