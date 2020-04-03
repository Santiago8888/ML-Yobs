import React, { Fragment, useState } from 'react'


const KanbanCard = ({ yob, apply, close }) => <a className="panel-block is-active">
    <article className="media">
        <div className="media-left">
            <figure className="image is-64x64">
                <img src={yob.logo} alt="Image" />
            </figure>
            { yob.company }
        </div>
        <div className="media-content">
            <div className="content">
                <nav className="level is-mobile">
                    <div className="level-left">
                        <h2 className="title is-4">  { yob.title } </h2>
                    </div>
                    <div className="level-right">
                        { 
                            yob.Applied 
                            ? 
                                <Fragment>
                                    <button 
                                        className="button is-primary is-ligh"
                                        onClick={()=> {
                                            apply(yob)
                                            window.open(yob.link)
                                        }}
                                    >Apply</button>
                                    <a className="delete" onClick={()=> close(yob)}/>
                                </Fragment>
                            : <button className="button is-danger is-light" onClick={()=> close(yob)}>Close</button>
                        }
                    </div>
                </nav>
            </div>

            <nav className="level is-mobile">
                <div className="level-left">
                    <h2 className="subtitle is-5" style={{marginBottom:0, color: '#822'}}> 
                        { yob.salary ? yob.salary : null } 
                    </h2>
                </div>
                <div className="level-right">
                    <p style={{marginTop: '1.25rem'}}>
                        <img src="location.png" style={{height:24}} alt="location-icon"/>
                        <i style={{padding:6}}>{ yob.location }</i>
                    </p>
                </div>
            </nav>
        </div>
    </article>
</a>



export const KanBan = ({ yobs, apply, close }) => {
    const [isApplied, setIsApplied] = useState(false)
    return <nav className="panel">
        <p className="panel-heading"> Active Oportunities </p>
        <p className="panel-tabs">
            <a className = {isApplied ? "is-active" : ''} onClick={()=> setIsApplied(false)}>Interested In</a>
            <a className = {isApplied ? "is-active" : ''} onClick={()=> setIsApplied(true)}>Applied</a>
        </p>
        { yobs.reverse().filter(({ Applied }) => Applied === isApplied).map(y => 
            <KanbanCard yob={y} apply={apply} close={close}/>
        )}
    </nav>
}
