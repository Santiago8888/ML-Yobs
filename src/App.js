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

import { NavBar, NotificationBar } from './components/Header'
import React, { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import 'bulma/css/bulma.css'



const App = () => {

    const [yob, setYob] = useState(null)
    const [user, setUser] = useState(null)
    const [suggestions, setSuggestions] = useState([])

    const [liked, setLiked] = useState([])
    const [rejected, setRejected] = useState([])
    const [kanban_yobs, setKanbanYobs] = useState([])

    const [counters, setCounters] = useState({})
    const [metrics, setMetrics] = useState({})


    useEffect(() => {
        async function fetchData(){ 
            const user = await get_user()
            setUser(user)

            const suggestions = await get_suggestions(user)
            setSuggestions(suggestions)
            get_next_suggestion()

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
        setUser({...user, MLocation: next_suggestion.MLocation})
        get_more_suggestions()
    }

    const handle_like = () => {
        setLiked([...liked, yob])
        setKanbanYobs([yob, ...kanban_yobs])
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
        liked ? handle_like() : setRejected([...rejected, yob])
        get_next_suggestion()
        setYob(null)
        edit_suggestion({...yob, Liked: liked})
    }

    const get_more_suggestions = async() => {
        if(suggestions.length < 10) {
            const new_suggestions = await save_suggestions(user)
            setSuggestions([...suggestions, ...new_suggestions])
        }
    }

    const subscribe = email => edit_user({...user, email: email})


    return <section className="section">
        <NavBar/>
        <NotificationBar/>
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
