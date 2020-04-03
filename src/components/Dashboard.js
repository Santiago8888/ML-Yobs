import React, { useState } from 'react'

export const MetricsCard = ({ total, liked, rejected }) => <div className="card">
    <header className="card-header">
        <p className={`card-header-title has-text-${align} is-uppercase`} style={{display:'block'}}> 
            Total Jobs 
        </p>
    </header>
    <div className="card-content">
        <div className="content"> 
            <p className={`title is-2 has-text-centered`}> { total } </p> 
        </div>
    </div>
    <footer className="card-footer">
        <a href="#" className="card-footer-item">
            { liked } <br/> Liked
        </a>
        <a href="#" className="card-footer-item">
            { rejected } <br/> Rejected
        </a>
    </footer>
</div>


export const TechStack = ({ tech }) => <aside className="menu">
    <p className="menu-label"> Tech Stack </p>
    <ul className="menu-list">
        { tech.map(({ _id, count })=> <li>
            <a> {_id} </a>
            <progress 
                className="progress is-info" 
                value={count} 
                max={Math.min(tech[0].count*2, tech[0].count + 10)}
            >{count}</progress>
        </li> )}
    </ul>
</aside>


export const ChartCard = ({ title, chart }) => <article className="message">
    <div className="message-header"><p>{ title }</p></div>
    <div className="message-body"> { chart } </div>
</article>


export const Contact = ({ subscribe }) => {
    const [email, setEmail] = useState('')
    return <div className="container has-text-centered">
        <h2 className="subtitle is-5">Subscribe to our NewsLetter</h2> 
        <p>Get Personalized Job Recommendations to your inbox</p> 
        <input 
            className="input" 
            type="text" 
            placeholder="We won't share your email :)" 
            style={{maxWidth: 500}}
            onChange={({ target }) => setEmail(target.value)}
        />
        <button
            style={{maxWidth:100}} 
            className="button is-black" 
            onClick={()=> subscribe(email)}
        >Submit</button>
    </div>
}
