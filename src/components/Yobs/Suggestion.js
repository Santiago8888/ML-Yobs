import React from 'react'

const YobCard = ({ job }) => <div className="card">
    <header className="card-header">
        <p className="card-header-title"> { job.company } </p>
    </header>
    <div className="card-content">
        <div className="content">
            <div className="media">
                <div className="media-left">
                    <figure className="image is-48x48">
                        <img src={job.logo} alt={`${job.company}-logo`} />
                    </figure>
                </div>
                <div className="media-content">
                    <p> {job.pitch} </p>
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
