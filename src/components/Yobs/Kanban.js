import React from 'react'

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
			<h2 className="subtitle is-5" style={{marginBottom:0, color: '#822'}}> 
				{ job.salary ? job.salary : null } 
			</h2>
			<p style={{marginTop: '1.25rem'}}>
				<img src="location.png" style={{height:24}} alt="location-icon"/>
				<i style={{padding:6}}>{ job.location }</i>
			</p>
            <div class="field">
                <div class="control">
                    <input class="input is-info" type="text" placeholder="Info input"/>
                </div>
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
