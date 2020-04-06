import {
    get_user,
    edit_user,
    get_counters,
    get_kanban_yobs,
    get_suggestions,
    edit_suggestion,
    save_suggestions,
    close_suggestion,
    apply_to_suggestion,
    get_dashboard_metrics,
    get_suggestion_history
} from './network/db'

import { NavBar } from './components/Header'
import React, { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import 'bulma/css/bulma.css'
import './App.css'

const f_yob = {
    _id: "{id: DataView(12)}",
    City: "Waterloo",
    Title: "Software Engineer",
    Link: "https://angel.co/company/hive/jobs",
    Salary: "$65k – $85k • 0.5% – 1.0%",
    Company: "Hive.co",
    Pitch: "Helping ecommerce brands send better email (YC S14)",
    Logo: "https://photos.angel.co/startups/i/460670-a3dc504ff514762461aefc35cbd1015a-medium_jpg.jpg?buster=1548716034",
    NumericSalary: 0.1525423729,
    Coords: "[42.4979693, -92.3329637]",
    Industry: 4,
    MLocation: "{coordinates: Array(2), type: \"Point\"}",
    TechStack: ["React", "Django", "Kubernetes", "Docker", "Java"],
    Description: "Hive is an email marketing CRM used by brands to personalize and automate their campaigns. We pride ourselves on helping brands understand their email marketing, all while selling more and keeping their customers engaged.\r\n\r\nWe integrate with tech partners like Shopify and Eventbrite to let brands act on all their data, so they can easily segment their list in thousands of ways, and send more customized, timely email campaigns that land in inboxes.\r\n\r\nWe started our company inside a University o...",
    distance: 0
}

const f_counters = {
    total: 83,
    liked: 0,
    rejected: 0
}

const App = () => {

    const [yob, setYob] = useState(f_yob)
    const [user, setUser] = useState(null)
    const [suggestions, setSuggestions] = useState([])

    const [liked, setLiked] = useState([])
    const [rejected, setRejected] = useState([])
    const [kanban_yobs, setKanbanYobs] = useState([])

    const [counters, setCounters] = useState(f_counters)
    const [metrics, setMetrics] = useState({})


    const get_more_suggestions = async(suggestions) => {
        if(suggestions.length < 10) {
            const new_suggestions = await save_suggestions(user)
            setSuggestions([...suggestions, ...new_suggestions])
        }
    }


    const get_next_suggestion = (user, suggestions) => {
        const min_distance_idx = suggestions.map(({ MLocation:{ coordinates:s }}) => 
            liked.reduce((d, { MLocation: l }) => (d + s[0] - l[0])**2 +  (s[1] - l[1])**2, 0)
            - rejected.reduce((d, { MLocation: r }) => (d + s[0] - r[0])**2 +  (s[1] - r[1])**2, 0)
        ).reduce((d, i, idx, l) => d[1] || i < d[1] ? [idx, i] : d, [0, null])[0]

        const next_suggestion = suggestions[min_distance_idx]
        setYob(next_suggestion)        
        setSuggestions(suggestions.filter((i, idx) => idx !== min_distance_idx))

        edit_user({...user, MLocation: next_suggestion.MLocation.coordinates})
        setUser({...user, MLocation: next_suggestion.MLocation})
        get_more_suggestions(suggestions)
    }


    useEffect(() => {
        async function fetchData(){ 
            const user = await get_user()
            setUser(user)

            const suggestions = await get_suggestions(user)
            setSuggestions(suggestions)
            get_next_suggestion(user, suggestions)

            const user_id = user.UserID
            const counters = await get_counters(user_id)
            setCounters(counters)

            const kanban_yobs = get_kanban_yobs(user_id)
            setKanbanYobs(kanban_yobs)

            const { liked, rejected } = await get_suggestion_history(user_id)
            setLiked(liked)
            setRejected(rejected)

            const metrics = await get_dashboard_metrics(user_id)
            setMetrics(metrics)
        }// fetchData()
    }, [])



    const handle_like = () => {
        setLiked([...liked, yob])
        setKanbanYobs([yob, ...kanban_yobs])
        setCounters({...counters, liked: counters.liked + 1})

        const { tech, industries, locations, salaries } = metrics
        const updated_tech = yob.TechStack.reduce((d, i) => [
            ...d.filter(({_id})=> _id !== i),
            { _id: i, count: (tech.find(({_id})=> _id === i) || {count : 0}).count + 1}
        ], tech)

        const updated_industries = [
            ...industries.filter(({_id})=> _id !== yob.Industry),
            { _id: yob.Industry, count: (tech.find(({_id})=> _id === yob.Industry) || {count : 0}).count + 1}
        ]

        setMetrics({
            tech: updated_tech,
            industries: updated_industries,
            salaries: [...salaries, yob.Salary],
            locations: [...locations, yob.Coords.coordinates]
        })
    }

    const handle_reject = () => {
        setRejected([...rejected, yob])
        setCounters({...counters, rejected: rejected.liked + 1})
    }

    const apply = yob => {
        apply_to_suggestion(yob)
        const move_yob = kanban_yobs.map(y => y._id === yob._id ? {...y, Liked: true}: y)
        setKanbanYobs(move_yob)
    } 

    const close = yob => {
        close_suggestion(yob)
        const dismiss_yob = kanban_yobs.filter(({ _id }) => _id !== yob._id)
        setKanbanYobs(dismiss_yob)
    }

    const like_yob = liked => {
        liked ? handle_like() : handle_reject()
        get_next_suggestion(suggestions)
        setYob(null)
        edit_suggestion({...yob, Liked: liked})
    }

    const subscribe = email => edit_user({...user, email: email})


    return <section className="section" style={{minHeight:'100vh', padding:0, backgroundColor:'aliceblue'}}>
        <NavBar/>
        <Layout 
            yob={yob} 
            apply={apply}
            close={close}
            like_yob={like_yob}
            kanban_yobs={kanban_yobs}
            counters={counters}
            metrics={metrics}
            subscribe={subscribe}
        />
    </section>
}


export default App
