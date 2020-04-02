import React from 'react'

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


export const TechStack = () => <aside className="menu">
    <p className="menu-label"> Tech Stack </p>
    <ul className="menu-list">
        <li><a> Python </a><progress className="progress is-primary" value="15" max="100">15%</progress></li>
        <li><a> ReactJS </a><progress className="progress is-primary" value="15" max="100">10%</progress></li>
    </ul>
</aside>


export const ChartCard = ({ title, chart }) => <article className="message">
    <div className="message-header"><p>{ title }</p></div>
    <div className="message-body"> { chart } </div>
</article>

// Salary Chart: https://uber.github.io/react-vis/documentation/series-reference/line-series
// Industry Chart: https://uber.github.io/react-vis/examples/showcases/radar-charts


export const Contact = () => <div className="container has-text-centered">
    <nav className="level is-mobile">
        <div className="level-left">
            <a className="level-item" aria-label="facebook">
                <span className="icon is-small">
                    <i className="fas fa-reply" aria-hidden="true"></i>
                </span>
            </a>
            <a className="level-item" aria-label="tweeter">
                <span className="icon is-small">
                    <i className="fas fa-retweet" aria-hidden="true"></i>
                </span>
            </a>
            <a className="level-item" aria-label="email">
                <span className="icon is-small">
                    <i className="fas fa-heart" aria-hidden="true"></i>
                </span>
            </a>
            <a className="level-item" aria-label="instagram">
                <span className="icon is-small">
                    <i className="fas fa-reply" aria-hidden="true"></i>
                </span>
            </a>
            <a className="level-item" aria-label="slack">
                <span className="icon is-small">
                    <i className="fas fa-reply" aria-hidden="true"></i>
                </span>
            </a>
        </div>
    </nav>
    <h2 className="subtitle is-5">Follow Us</h2> 
</div>