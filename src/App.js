import 'bulma/css/bulma.css'
import React from 'react'


const NavBar = () => <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
        <a className="navbar-item">
            <img src="banner.png" width="112" height="28" />
        </a>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
            <a className="navbar-item"> Home </a>
            <a className="navbar-item"> Documentation </a>

            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link"> More </a>
                <div className="navbar-dropdown">
                    <a className="navbar-item"> About </a>
                    <a className="navbar-item"> Jobs </a>
                    <a className="navbar-item"> Contact </a>
                    <hr className="navbar-divider" />
                    <a className="navbar-item"> Report an issue </a>
                </div>
            </div>
        </div>

        <div className="navbar-end">
            <div className="navbar-item">
                <div className="buttons">
                    <a className="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a className="button is-light"> Log in </a>
                </div>
            </div>
        </div>
    </div>
</nav>


const NotificationBar = () => <div className="notification is-primary">
    Software Engineer Jobs RECOMMENDATION ENGINE.
</div>


const MetricsCard = () => <div className="card">
    <header className="card-header">
        <p className={`card-header-title has-text-${align} is-uppercase`} style={{display:'block'}}> 
            Total Jobs 
        </p>
    </header>
    <div className="card-content">
        <div className="content"> 
            <p className={`title is-2 has-text-centered`}> { content } </p> 
        </div>
    </div>
    <footer className="card-footer">
        <a href="#" className="card-footer-item">
            0 <br/> Liked
        </a>
        <a href="#" className="card-footer-item">
            0 <br/> Rejected
        </a>
    </footer>
</div>


const TechStack = () => <aside className="menu">
    <p className="menu-label"> Tech Stack </p>
    <ul className="menu-list">
        <li><a> Python </a><progress className="progress is-primary" value="15" max="100">15%</progress></li>
        <li><a> ReactJS </a><progress className="progress is-primary" value="15" max="100">10%</progress></li>
    </ul>
</aside>


const ChartCard = ({ title, chart }) => <article className="message">
    <div className="message-header"><p>{ title }</p></div>
    <div className="message-body"> { chart } </div>
</article>

// Salary Chart: https://uber.github.io/react-vis/documentation/series-reference/line-series
// Industry Chart: https://uber.github.io/react-vis/examples/showcases/radar-charts


const Contact = () => <div className="container has-text-centered">
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


const YobCard = ({ company, job }) => <div className="card">
    <header className="card-header">
        <p className="card-header-title"> { company.name } </p>
    </header>
    <div className="card-content">
        <div className="content">
            <div className="media">
                <div className="media-left">
                    <figure className="image is-48x48">
                        <img src={company.source} alt={`${company.name}-logo`} />
                    </figure>
                </div>
                <div className="media-content">
                    <p> {company.description} </p>
                </div>
                { /* TODO: Implement Tech Stack Carousel. */} 
            </div>

            <p> {job.description} </p>

			<h2 className="title is-4">  { job.title } </h2>
			<h2 className="subtitle is-5" style={{marginBottom:0, color: '#822'}}> 
				{ job.salary ? job.salary : null } 
			</h2>
			<p style={{marginTop: '1.25rem'}}>
				<img src="location.png" style={{height:24}} alt="location-icon"/>
				<i style={{padding:6}}>{ job.location }</i>
			</p>
        </div>
    </div>
    <footer className="card-footer">
        <a href="#" className="card-footer-item">Reject</a>
        <a href="#" className="card-footer-item">Apply</a>
        <a href="#" className="card-footer-item">Like</a>
    </footer>
</div>


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


const KanbanCard = ({ job }) => <div className="box">
    <article className="media">
        <div className="media-left">
            <figure className="image is-64x64">
                <img src={job.logo} alt="Image" />
            </figure>
            { job.company }
        </div>
        <div className="media-content">
            <div className="content">
                <nav className="level is-mobile">
                    <div className="level-left">
                        <h2 className="title is-4">  { job.title } </h2>
                    </div>
                    <div className="level-right">
                        <div className="dropdown is-hoverable">
                            <div className="dropdown-trigger">
                                <p> { job.stage } </p>
                                <span className="icon is-small">
                                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                                <div className="dropdown-content">
                                    <a href="#" className="dropdown-item"> Interested </a>
                                    <a href="#" className="dropdown-item"> Applied </a>
                                    <a href="#" className="dropdown-item"> First Interview </a>
                                    <a href="#" className="dropdown-item"> Technical Stage </a>
                                    <a href="#" className="dropdown-item"> Culture Assesment </a>
                                    <a href="#" className="dropdown-item"> Presented Offer </a>
                                    <a href="#" className="dropdown-item"> Negotiation </a>
                                    <hr className="dropdown-divider" />
                                    <a href="#" className="dropdown-item"> Accepted Offer </a>
                                    <a href="#" className="dropdown-item"> No Longer Interested </a>
                                    <a href="#" className="dropdown-item"> Rejected </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <nav className="level is-mobile">
                <div className="level-left">
                    <a className="level-item" aria-label="Applauses">
                        <span className="icon is-small"><i className="fas fa-reply" aria-hidden="true"></i></span>
                    </a>
                    <a className="level-item" aria-label="Comments">
                        <span className="icon is-small"><i className="fas fa-retweet" aria-hidden="true"></i></span>
                    </a>
                    <a className="level-item" aria-label="Plus">
                        <span className="icon is-small"><i className="fas fa-heart" aria-hidden="true"></i></span>
                    </a>
                    <a className="level-item" aria-label="Minus">
                        <span className="icon is-small"><i className="fas fa-heart" aria-hidden="true"></i></span>
                    </a>
                    <a className="level-item" aria-label="Notes">
                        <span className="icon is-small"><i className="fas fa-heart" aria-hidden="true"></i></span>
                    </a>
                    <a className="level-item" aria-label="To Do">
                        <span className="icon is-small"><i className="fas fa-heart" aria-hidden="true"></i></span>
                    </a>
                </div>
            </nav>
        </div>
    </article>
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
