import React, { useState } from 'react'

export const MetricsCard = ({ counters: { total, liked, rejected }}) => <div className="card">
    <header className="card-header">
        <p className={`card-header-title has-text-centered is-uppercase`} style={{display:'block'}}> 
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
    const [disabled, setDisabled] = useState(true)


    return <div className="container has-text-centered" style={{height:100, marginTop:20}}>
        <h2 className="subtitle is-4" style={{marginBottom:0}}>Subscribe To Our Newsletter</h2> 
        <p style={{marginBottom:'.5rem'}}>Get Personalized Job Recommendations directly to your inbox</p> 
        <input 
            disabled={!disabled}
            className="input" 
            type="text" 
            placeholder="We won't share your email :)" 
            style={{maxWidth: 450}}
            onChange={({ target }) => setEmail(target.value)}
        />
        <button
            style={{maxWidth:100}} 
            className="button is-black" 
            onClick={()=> {
                setDisabled(true)
                setEmail('Thank you!')
                subscribe(email)
            }}
        >Submit</button>
    </div>
}
