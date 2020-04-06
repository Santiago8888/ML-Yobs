import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'
import tech from '../../data/tech.json'
import React, { Fragment } from 'react'


const th_siz = 50
const TechStack = ({ images }) => <div style={{marginBottom:'1.5rem'}}>
    <Carousel 
        emulateTouch 
        width={'340px'} 
        showThumbs={false} 
        showIndicators={false} 
        showStatus={false}
        showArrows={false}
    >
        {images.map((i, idx) => <div key={idx}>
            <img src={ i[0].src } alt={`tech-${idx}`} style={{height:th_siz, width:th_siz}}/>
            { i[1] ? <img src={ i[1].src } alt={`tech-${idx}`} style={{height:th_siz, width:th_siz, margin:'0px 20px'}}/> : null }
            { i[2] ? <img src={ i[2].src } alt={`tech-${idx}`} style={{height:th_siz, width:th_siz}}/> : null }
            { i[3] ? <img src={ i[3].src } alt={`tech-${idx}`} style={{height:th_siz, width:th_siz, margin:'0px 20px'}}/> : null }
        </div>)}
    </Carousel>
</div>

const JobTitle = ({ yob }) => <Fragment>
    <h2 className="title is-4" style={{marginBottom:'0.5rem'}}>  { yob.Title } </h2>
</Fragment>


const CompanyMedia = ({ yob }) => <div className="media" style={{marginBottom:'1.5rem', marginBottom:0}}>
    <div className="media-left has-text-centered">
        <figure className="image is-96x96" style={{margin:0, marginBottom:10}}>
            <img src={yob.Logo || 'logo.png'} alt={`${yob.Company}-logo`} />
        </figure>
    </div>
    <div className="media-content" >
        <p className="title is-3" style={{marginBottom:0}}> { yob.Company } </p>
        <p style={{maxWidth:200}}> {yob.Pitch} </p>
    </div>
</div>


export const JobFooter = ({ like_yob }) => <nav 
    className="level has-text-centered" 
    style={{
        width:340, 
        position:'absolute', 
        bottom:'10px',
        background: 'linear-gradient(white, whitesmoke)',
        marginLeft: '-1.5rem'
    }}
>
    <div className="level-left" style={{margin:'auto auto 10px 50px'}}>
        <a onClick={()=>like_yob(false)}>
            <img src={ 'dislike.png' } alt={`unliked-logo`} style={{height:75, marginTop:10}}/>
        </a>
    </div>
    <div className="level-left" style={{margin:'auto 50px 16px auto'}}>
        <a onClick={()=>like_yob(false)}>
            <img src={ 'like.png' } alt={`liked-logo`}  style={{height:75, marginTop:-20}}/>
        </a>
    </div>
</nav>



export const Suggestion = ({ yob, like_yob }) => <div 
    className="card" 
    style={{
        height:'calc(100vh - 3rem - 360px)', 
        background: 'linear-gradient(whitesmoke, white 20%)',
        width: 'calc(340px + 3rem)',
        margin: 'auto',
        marginBottom: 20
    }}
>
    <header className="card-header" style={{display: 'block', padding: 20, paddingBottom: 10}}>
        <JobTitle yob={yob}/>
    </header>
    <div className="card-content" style={{height: 'calc(100% - 150px)', padding:'1rem 1.5rem'}}>
        <div className="content">
            <CompanyMedia yob={yob} />
            <nav className="level has-text-centered" style={{marginBottom: '1.5rem'}}>
                <div className="level-left" style={{margin:'auto'}}>
                    <div style={{display: 'inline-flex'}}>
                        <img src="location.png" style={{height:24}} alt="location-icon"/>
                        <p> <i style={{padding:6}}>{ yob.City }</i></p>
                    </div>
                </div>
                <div className="level-right" style={{margin:'auto'}}>
                    <h2 className="subtitle is-6" style={{marginBottom:0, color: '#822'}}> 
                        { yob.Salary ? yob.Salary : null } 
                    </h2>
                </div>
            </nav>
            <TechStack images={
                yob.TechStack
                .map(t=> ({src:tech[t], text:t}))
                .filter(({ src }) => src)
                .reduce((d, i, idx, l)=> (idx % 4) === 0
                    ? [...d, [i, l[idx + 1], l[idx + 2], l[idx + 3]]]
                    : d, []
                )
            }/>
            <p style={{width:330, marginLeft:5, textAlign:'center'}}> {
                yob.Description.split('.')
                .reduce((d,i)=> 
                    i.length + d.counter < 250 
                    ? {counter: i.length + d.counter, text:`${d.text}.${i}`} 
                    : d ,{counter:0, text:''}
                ).text
            } </p>
            <JobFooter like_yob={like_yob} />

        </div>
    </div>
</div>
