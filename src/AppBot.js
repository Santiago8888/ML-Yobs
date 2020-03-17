import { 
    RemoteMongoClient, 
    Stitch, 
    AnonymousCredential 
} from 'mongodb-stitch-browser-sdk'

import { ColumnLayer } from '@deck.gl/layers'

import DeckGL, {FlyToInterpolator} from 'deck.gl'
import React, { Fragment } from 'react'
import ReactMapGL from 'react-map-gl'

import amplitude from 'amplitude-js'

import 'bulma-pageloader/dist/css/bulma-pageloader.min.css'
import 'bulma/css/bulma.css'
import './App.css'

import {
    lightingEffect,
    initialViewState,
    TOOLTIP_STYLE,
    MAP_STYLES,
    INFOWINDOW_STYLE,
    colorRange,
    question_style,
    primary_button_style,
    secondary_button_style,
    onboarding_tootlip_style
} from './styles/bot_styles'


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZHpldGEiLCJhIjoiY2s2cWFvbjBzMDIzZzNsbnhxdHI5eXIweCJ9.wQflyJNS9Klwff3dxtHJzg'
const AMPLITUDE_DEV = 'a35ebf8c138533d4dc9f9e2a341eca61'
const AMPLITUDE_PROD = 'f0d03d5f2e5bd29318dcd0c8251638ff'
const AMPLITUDE_KEY = window.location.hostname !== 'localhost' ? AMPLITUDE_PROD : AMPLITUDE_DEV

const collection = 'Yobs'
const client = Stitch.initializeDefaultAppClient('yobs-wqucd')

const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(collection)
const get_yobs = () => db.collection(collection).find({}, { limit: 100}).asArray().catch(console.log)


class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			object: {},
			name: null,
			cta: false,
			tooltip_id: null,
			loaded: false,
			tooltipped: false,
            fake_tooltip: null,

            viewport: initialViewState,
            stage: 'first',
        }
        
	}

	async componentDidMount(){
		const {id } = await client.auth.loginWithCredential(new AnonymousCredential())
		amplitude.getInstance().init(AMPLITUDE_KEY, id)
        amplitude.getInstance().logEvent('New Visit')
        
        this.setState({ data: [] })

        const yobs = await get_yobs()
        const yob = yobs[42]
		this.setState({ data: yobs })
		document.getElementById('deckgl-wrapper').addEventListener('contextmenu', evt => evt.preventDefault())
        this.setState({fake_tooltip: `${yob.title}<br/> ${yob.city}<br/> ${yob.salary !== 'N/A' ? yob.salary : ''}` })
    }

	_getTooltip = ({ object }) => {
		object && this.state.tooltip_id !== object.title 
			? this.setState({tooltip_id: object.title, tooltipped: true}, () => amplitude.getInstance().logEvent('Set Tooltip', object)) 
			: this.setState({ tooltipped: true })

		return object
		? 	{ text:`${object.title}\n ${object.city}\n ${object.salary !== 'N/A' ? object.salary : ''}`, style: TOOLTIP_STYLE }
		:	null
    }

    _onViewportChange = viewport => this.setState({ viewport: {...this.state.viewport, ...viewport} })    
    _goToViewport = props => {
        this._onViewportChange({
            ...props,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator()            
        })
    }
	
	_getInfoWindow = ({ object }) => !this.state.name
		? 
			this.setState(
				{ object: object ? object : {}, cta: !!object, tooltipped: true }, 
				() => amplitude.getInstance().logEvent('Select Job', object)
			)
		: null

	render() {
		const { data, loaded, fake_tooltip, stage, viewport } = this.state

		const layers = [
			new ColumnLayer({
				id: 'column-layer',
				data,
				diskResolution: 12,
				radius: 250,
				extruded: true,
				pickable: true,
				elevationScale: 10,
				getPosition: d => d.centroid,
				getFillColor: d => colorRange[d.category],
				getLineColor: [0, 0, 0],
				getElevation: d => d.value/500,
			})
        ]


        const bot_question = stage => ({
            first: <span> Hi Santiago! <br/> I found this job for you. <br/> What do you think? </span>,
            second: <span> Got it! How about this? </span>,
            third: <span> Do you want me to apply for you? </span>,
            fourth: null,
            end: <span> Done, <br/> Good Luck! </span>
        })[stage]

        const primary_button = stage => ({
            first: `I like it.`,
            second: `Perfect!`,
            third: `Yes!`,
            fourth: null,
            end: `Find me another Job please.`
        })[stage]

        const secondary_button = stage => ({
            first: `Is there Anything that pays more?`,
            second: `Is better, are there any more choices?`,
            third: `Wait, show me the cover letter you'll send.`,
            fourth: null,
            end: `Explore the Map instead.`
        })[stage]

        const tertiary_button = stage => ({
            first: 'I prefer a Position in ...',
            second: `No thanks, today I will search by myself.`,
            third: `Not yet, save it for later.`,
            fourth: null,
            end: null
        })[stage]

        const fourth_button = stage => ({
            first: 'Something closer to home, please.',
            second: null,
            third: 'Show me the requirements please.',
            fourth: null,
            end: null
        })[stage]

        const select_stage = () => ({
            first: { stage: 'second' },
            second: { stage: 'third' },
            third: { stage: 'fourth' },
            fourth: { stage: 'end' },
            end: { stage: 'first' }
        })[stage]


        const InfoWindow = <div 
            align='center' 
            style={ INFOWINDOW_STYLE } 
            tabIndex='0'
            onClick={()=> this.setState({...select_stage()})}
        >
            {
                stage !== 'end'
                ?   
                    <div className='container' style={{ display: stage === 'fourth' ? 'none' : 'auto' }}>
                        <button className='pulse-button'></button>
                    </div>
                :   
                    <img 
                        alt='success'
                        style={{height:150, margin:25 }} 
                        src="https://media1.tenor.com/images/22919ad969d4fcf8280c47f4c4d6a643/tenor.gif?itemid=15903843"
                    />
            }
            <p style={question_style}> { bot_question(stage) }  </p>

            <div style={{margin:16}} align="center">
                {
                    primary_button(stage) 
                    ?   
                        <a 
                            style={primary_button_style} 
                            onClick={()=> this.setState({...select_stage()})}
                        > { primary_button(stage) } </a>
                    :   null
                } {

                    secondary_button(stage) 
                    ?   
                        <a 
                            style={secondary_button_style} 
                            onClick={()=> {
                                this._goToViewport({latitude: 40.69279, longitude: -73.9878993247973, bearing: 25})
                                const yob = data[19]
                                this.setState({...select_stage(), fake_tooltip: null})
                                setTimeout(() => 
                            		this.setState({
                                        fake_tooltip: `${yob.title}<br/> ${yob.city}<br/> ${yob.salary !== 'N/A' ? yob.salary : ''}` })
                                ,1000)
                            }}
                        > { secondary_button(stage) } </a>
                    :   null
                } {
                    tertiary_button(stage) 
                    ?
                        <a 
                            style={{...secondary_button_style, color: 'darkgreen', border: '4px solid darkgreen'}}
                        > { tertiary_button(stage) } </a>
                    :   null
                } {
                    fourth_button(stage) 
                    ?
                        <a 
                            style={{...secondary_button_style, color: 'darkorange', border: '4px solid darkorange'}}
                        > { fourth_button(stage) } </a>
                    :   null
                }
            </div>
        </div>
      
		const intro = <div 
			className={`pageloader ${!loaded ? 'is-active' : null}`}
			style={{backgroundColor: '#9ed0e2' }}
		><span className='title' style={{ color:'#1e5163' }}>Finding the best jobs in New York...</span></div>

		const onboarding_tooltip = <div 
			className='deck-tooltip' 
			style={onboarding_tootlip_style}
        >{ 
				fake_tooltip 
				? 	fake_tooltip.split('<br/>').map((i, idx) => <Fragment key={idx}> {i} <br/></Fragment>) 
				: 	null
        }</div>

		const main = <DeckGL
			onContextMenu={event => event.preventDefault()}
			initialViewState={viewport}
			getTooltip={this._getTooltip}
			onClick={this._getInfoWindow}
			controller={true}
			layers={layers}
            effects={[lightingEffect]}
            viewState={ viewport }
            onViewStateChange={({ viewState }) => this._onViewportChange(viewState)}
        >
			{ InfoWindow }
            <ReactMapGL 
				onContextMenu={event => event.preventDefault()}
				mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} 
				mapStyle={`mapbox://styles/mapbox/${MAP_STYLES[2]}`}
				attributionControl={false}
                onLoad={()=> setTimeout(() => this.setState({loaded: true}), 1000)}
                transitionDuration={1000}
                transitionInterpolator={new FlyToInterpolator()}
            />
		</DeckGL>

		return <Fragment>
			{ intro }
			{ fake_tooltip ? onboarding_tooltip : null }
			{ main }
		</Fragment>
	}
}


export default App
