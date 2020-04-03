import { MetricsCard, TechStack, ChartCard, Contact } from './Dashboard'
import { IndustriesChart, SalaryChart } from './Chart'
import { Suggestion } from './Yobs/Suggestion'
import { KanBan } from './Yobs/Kanban'
import { HeatMap } from './Maps'
import React, { useState } from 'react'


const Main = ({ yob, like_yob, kanban_yobs, apply, close }) => {
    const [activeTab, setActiveTab] = useState(0)
    return <div className="container">
        {   !activeTab
                ?   <Suggestion yob={yob} like_yob={like_yob}/>
                :   <KanBan yobs={kanban_yobs} apply={apply} close={close}/>
        }
        <div className="tabs">
            <ul>
                <li className={!activeTab ? "is-active" : ''} onClick={setActiveTab(0)}><a>Suggestions</a></li>
                <li className={activeTab ? "is-active" : ''} onClick={setActiveTab(1)}><a>Kanban</a></li>
                <li hidden><a>Map</a></li>
                <li hidden><a>Graph</a></li>
            </ul>
        </div>
    </div>
}


export const Layout = ({ yob, like_yob, counters, metrics, kanban_yobs, apply, close, subscribe }) => <div className="columns">
    <div className="column is-2">
        { counters ? <MetricsCard counters={counters}/> : null }
        { metrics.tech && counters.liked > 1 ? <TechStack tech={metrics.tech}/> : null }
    </div>
    <div className="column is-7">
        { 
            yob 
                ?   
                    <Main 
                        yob={yob} 
                        like_yob={like_yob} 
                        kanban_yobs={kanban_yobs}
                        apply={apply}
                        close={close}
                    /> 
                :   null 
        }
        <Contact subscribe={subscribe}/>
    </div>
    <div className="column is-3"> { 
            metrics.industries && counters.liked > 4 
                ?   <ChartCard title={'By Industry'} chart={<IndustriesChart industries={metrics.industries}/>}/> 
                :   null 
        } { 
            metrics.locations && counters.liked > 3 
                ?   <ChartCard title={'By Location'} chart={<HeatMap locations={metrics.locations}/>}/> 
                :   null 
        } { 
            metrics.salary && counters.liked > 2 
                ?   <ChartCard title={'By Salary'} chart={<SalaryChart salaries={metrics.salary}/>}/> 
                :   null 
    } </div>
</div>
