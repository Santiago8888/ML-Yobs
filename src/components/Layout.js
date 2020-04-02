import { MetricsCard, TechStack, ChartCard, Contact } from './Dashboard'
import { Suggestion } from './Yobs/Suggestion'
import React from 'react'


const Main = ({ yob, like_yob }) => <div className="container">
    <Suggestion yob={yob} like_yob={like_yob}/>
    <div class="tabs">
        <ul>
            <li class="is-active"><a>Suggestions</a></li>
            <li><a>Kanban</a></li>
            <li hidden><a>Map</a></li>
            <li hidden><a>Graph</a></li>
        </ul>
    </div>
</div>


export const Layout = ({ yob, like_yob, counters, metrics }) => <div className="columns">
    <div className="column is-2">
        { counters ? <MetricsCard counters={counters}/> : null }
        { metrics.tech && counters.liked > 1 ? <TechStack tech={metrics.tech}/> : null }
    </div>
    <div className="column is-7">
        { yob ? <Main yob={yob} like_yob={like_yob}/> : null }
        <Contact/>
    </div>
    <div className="column is-3">
        { metrics.industries && counters.liked > 4 ? <ChartCard title={'By Industry'} chart={<div/>}/> : null }
        { metrics.locations && counters.liked > 3 ? <ChartCard title={'By Location'} chart={<div/>}/> : null }
        { metrics.salary && counters.liked > 2 ?  <ChartCard title={'By Salary'} chart={<div/>}/> : null }
    </div>
</div>
