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


const Header = () => <div class="notification is-primary">
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
    <footer class="card-footer">
        <a href="#" class="card-footer-item">
            0 <br/> Liked
        </a>
        <a href="#" class="card-footer-item">
            0 <br/> Rejected
        </a>
    </footer>
</div>


const TechStack = () => <aside class="menu">
    <p class="menu-label"> Tech Stack </p>
    <ul class="menu-list">
        <li><a> Python </a><progress class="progress is-primary" value="15" max="100">15%</progress></li>
        <li><a> ReactJS </a><progress class="progress is-primary" value="15" max="100">10%</progress></li>
    </ul>
</aside>


const ChartCard = ({ chart }) => <article class="message">
    <div class="message-header">
        <p>Prefered Salary Distribution</p>
    </div>
    <div class="message-body"> { chart } </div>
</article>

// Salary Chart: https://uber.github.io/react-vis/documentation/series-reference/line-series
// Industry Chart: https://uber.github.io/react-vis/examples/showcases/radar-charts


const YobCard = ({ company, job }) => <div class="card">
    <header class="card-header">
        <p class="card-header-title"> { company.name } </p>
    </header>
    <div class="card-content">
        <div class="content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <img src={company.source} alt={`${company.name}-logo`} />
                    </figure>
                </div>
                <div class="media-content">
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
    <footer class="card-footer">
        <a href="#" class="card-footer-item">Reject</a>
        <a href="#" class="card-footer-item">Apply</a>
        <a href="#" class="card-footer-item">Like</a>
    </footer>
</div>




const App = () => ({})



export default App
