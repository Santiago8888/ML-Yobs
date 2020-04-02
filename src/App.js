import { 
    get_ranked_cached_suggestions,
    heat_map_aggregate,
    industry_counter,
    likes_counter,
    tech_counter,
    kanban_array,
    salary_array,
    map_yobIds
} from './pipelines/suggestions'

import {
    yobs_counter,
    suggest
} from './pipelines/jobs'


import { RemoteMongoClient, Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'
import { MetricsCard, TechStack, ChartCard, Contact } from './components/Dashboard'
import { NavBar, NotificationBar } from './components/Header'
import { Suggestion } from './components/Yobs/Suggestion'
import React, { useEffect, useState } from 'react'
import 'bulma/css/bulma.css'


const client = Stitch.initializeDefaultAppClient('yobs-wqucd')
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')

const usersDB = db.collection('devUsers')
const yobsDB = db.collection('devYobs')
const suggestionsDB = db.collection('devSuggestions')


const init_dashboard = async user_id => {
    const total_yobs = await yobsDB.aggregate(yobs_counter).toArray()
    const likes_metrics = await suggestionsDB.aggregate(likes_counter(user_id)).toArray()
    const tech_stack = await suggestionsDB.aggregate(tech_counter(user_id)).toArray()

    const industries = await suggestionsDB.aggregate(industry_counter(user_id)).toArray()
    const location_likes = await suggestionsDB.aggregate(heat_map_aggregate(user_id)).toArray()
    const salary_distribution = await suggestionsDB.aggregate(salary_array(user_id)).toArray()

    return {
        yobs: total_yobs,
        likes: likes_metrics,
        tech: tech_stack,
        industries: industries,
        locations: location_likes,
        salaries: salary_distribution
    }
}

const init_user = async user_id => {
    const inital_location = [0, 0]
    await usersDB.insertOne({ UserID: user_id, MLocation: inital_location}).catch(console.log)
    const suggestions = await yobsDB.aggregate(suggest(inital_location)).toArray()
    return suggestions
}

const get_new_suggestions = ({ MLocation }) =>  await yobsDB.aggregate(suggest(MLocation)).toArray()



const network_requests = async () => {
    const { id: user_id } = await client.auth.loginWithCredential(new AnonymousCredential())
    const suggestions = await suggestionsDB.aggregate(get_cached_suggestions(user_id)).toArray()
    const user = await usersDB.findOne({ UserID: user_id }).asArray().catch(console.log)

    const new_suggestions = !user
        ?   await init_user(user_id)
        :   await get_new_suggestions(user)

    const kanban_cards = await suggestionsDB.aggregate(kanban_array(user_id)).toArray()
    const dashboard_metrics = await init_dashboard(user_id)

    return {
        suggestions: [...suggestions, new_suggestions], // TODO: Sort by Ranking.
        kanban_cards,
        dashboard_metrics
    }
}



const get_user = async () => {
    const { id: user_id } = await client.auth.loginWithCredential(new AnonymousCredential())
    const user = await usersDB.findOne({ UserID: user_id }).asArray().catch(console.log)

    if(!user){
        const inital_location = [Math.random()*100, Math.random()*100]
        const new_user = { UserID: user_id, MLocation: inital_location}
        await usersDB.insertOne(new_user).catch(console.log)
        return new_user
    } else { return user }
}


const get_suggestions = async user => {
    const suggestions = await suggestionsDB.aggregate(get_ranked_cached_suggestions(user)).toArray()

    if(suggestions.length < 10){
        const { yobIds } = (await suggestionsDB.aggregate(map_yobIds(user.UserID)).toArray())[0]
        const new_suggestions = await yobsDB.aggregate(suggest(user.MLocation)).toArray()
        return [...suggestions, ...new_suggestions.filter(({ JobId }) => !yobIds.includes(JobId))]        
    } else { return suggestions }
}


const edit_user = ({_id, ...doc}) => usersDB.updateOne({ _id: new BSON.ObjectID(_id)}, {$set: doc}).catch(console.log)



const Main = ({ yob, like_yob }) => <div className="container">
    { yob ? <Suggestion yob={yob} like_yob={like_yob}/> : null }
    <div class="tabs">
        <ul>
            <li class="is-active"><a>Suggestions</a></li>
            <li><a>Kanban</a></li>
            <li hidden><a>Map</a></li>
            <li hidden><a>Graph</a></li>
        </ul>
    </div>
</div>


const Layout = ({ yob, like_yob }) => <div className="columns">
    <div className="column is-2">
        <MetricsCard/>
        <TechStack/>
    </div>
    <div className="column is-7">
        <Main yob={yob} like_yob={like_yob}/>
        <Contact/>
    </div>
    <div className="column is-3">
        <ChartCard title={'By Industry'} chart={<div/>}/>
        <ChartCard title={'By Location'} chart={<div/>}/>
        <ChartCard title={'By Salary'} chart={<div/>}/>        
    </div>
</div>



const App = () => {
    const [yob, setYob] = useState({})
    const [user, setUser] = useState(null)
    const [suggestions, setSuggestions] = useState([])

    const [liked, setLiked] = useState([])
    const [rejected, setRejected] = useState([])

    useEffect(() => {
        async function fetchData(){ 
            const user = await get_user()
            setUser(user)

            const suggestions = await get_suggestions()
            setSuggestions(suggestions)

            get_next_suggestion()
        } fetchData()
    }, [])

    const get_next_suggestion = () => {
        const min_distance_idx = suggestions.map(({ MLocation: s }) => 
            liked.reduce((d, ({ MLocation: l }) => (d + s[0] - l[0])**2 +  s[1] - l[1])**2, 0)
            - rejected.reduce((d, ({ MLocation: r }) => (d + s[0] - r[0])**2 +  s[1] - r[1])**2, 0)
        ).reduce((d, i, idx, l) => d[1] || i < d[1] ? [idx, i] : d, [null, null])[0]

        const next_suggestion = yobs[min_distance_idx]
        setYob(next_suggestion)        
        setSuggestions(suggestions.filter((i, idx) => idx !== min_distance_idx))
        edit_user({...user, MLocation: next_suggestion.MLocation})
    }

    const like_yob = liked => {
        liked ? setLiked([...rejected, yob]) : setRejected([...rejected, yob])
        get_next_suggestion()
        setYob(null)
    }


    return <section class="section">
        <NavBar/>
        <NotificationBar/>
        <Layout yob={yob} like_yob={like_yob}/>
    </section>
}

export default App
