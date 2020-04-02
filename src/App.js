import { 
    get_cached_suggestions,
    heat_map_aggregate,
    industry_counter,
    likes_counter,
    tech_counter,
    kanban_array,
    salary_array
} from './pipelines/suggestions'

import {
    yobs_counter,
    get_suggestions
} from './pipelines/jobs'


import { RemoteMongoClient, Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'
import { MetricsCard, TechStack, ChartCard, Contact } from './components/Dashboard'
import { NavBar, NotificationBar } from './components/Header'
import 'bulma/css/bulma.css'
import React, { useEffect } from 'react'


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
    const suggestions = await yobsDB.aggregate(get_suggestions(inital_location)).toArray()
    return suggestions
}

const get_new_suggestions = ({ MLocation }) =>  await yobsDB.aggregate(get_suggestions(MLocation)).toArray()



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


const Main = ({ children }) => <div className="container">
    { children }
    <div class="tabs">
        <ul>
            <li class="is-active"><a>Suggestions</a></li>
            <li><a>Map</a></li>
            <li><a>Kanban</a></li>
            <li><a>Graph</a></li>
        </ul>
    </div>
</div>


const Layout = () => <div className="columns">
    <div className="column is-2">
        <MetricsCard/>
        <TechStack/>
    </div>
    <div className="column is-7">
        <Main/>
        <Contact/>
    </div>
    <div className="column is-3">
        <ChartCard title={'By Industry'} chart={<div/>}/>
        <ChartCard title={'By Location'} chart={<div/>}/>
        <ChartCard title={'By Salary'} chart={<div/>}/>        
    </div>
</div>


const App = () => {
    useEffect(() => {
        async function fetchData(){await network_requests()}        
        fetchData()
    }, [])
      
    return <section class="section">
        <NavBar/>
        <NotificationBar/>
        <Layout/>
    </section>
}

export default App
