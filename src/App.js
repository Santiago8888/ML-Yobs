import { MetricsCard, TechStack, ChartCard, Contact } from './components/Dashboard'
import { NavBar, NotificationBar } from './components/Header'
import 'bulma/css/bulma.css'
import React from 'react'



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


const App = () => <section class="section">
    <NavBar/>
    <NotificationBar/>
    <Layout/>
</section>


export default App
