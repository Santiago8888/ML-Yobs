import React from 'react'


export const Suggestion = ({ yob, like_yob }) => <div className="card">
    <header className="card-header">
        <p className="card-header-title"> { yob.Company } </p>
    </header>
    <div className="card-content">
        <div className="content">
            <div className="media">
                <div className="media-left">
                    <figure className="image is-48x48">
                        <img src={yob.Logo} alt={`${yob.Company}-logo`} />
                    </figure>
                </div>
                <div className="media-content">
                    <p> {yob.Pitch} </p>
                </div>
                { /* TODO: Implement Tech Stack Carousel. */} 
            </div>

            <p> {yob.Description} </p>

            <h2 className="title is-4">  { yob.Title } </h2>
            <h2 className="subtitle is-5" style={{marginBottom:0, color: '#822'}}> 
                { yob.Salary ? yob.Salary : null } 
            </h2>
            <p style={{marginTop: '1.25rem'}}>
                <img src="location.png" style={{height:24}} alt="location-icon"/>
                <i style={{padding:6}}>{ yob.Location }</i>
            </p>
        </div>
    </div>
    <footer className="card-footer">
        <a href="#" className="card-footer-item" onClick={()=> like_yob(false)}>Reject</a>
        <a hidden href="#" className="card-footer-item">Apply</a>
        <a href="#" className="card-footer-item" onClick={()=> like_yob(true)}>Like</a>
    </footer>
</div>
