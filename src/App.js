
import { RemoteMongoClient, Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'

import React, { Fragment } from 'react'
import { ColumnLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import amplitude from 'amplitude-js'
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core'

import 'bulma/css/bulma.css'
import 'bulma-pageloader/dist/css/bulma-pageloader.min.css'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZHpldGEiLCJhIjoiY2s2cWFvbjBzMDIzZzNsbnhxdHI5eXIweCJ9.wQflyJNS9Klwff3dxtHJzg'
const AMPLITUDE_DEV = 'a35ebf8c138533d4dc9f9e2a341eca61'
const AMPLITUDE_PROD = 'f0d03d5f2e5bd29318dcd0c8251638ff'
const AMPLITUDE_KEY = window.location.hostname !== 'localhost' ? AMPLITUDE_PROD : AMPLITUDE_DEV


const collection = 'Yobs'
const client = Stitch.initializeDefaultAppClient('yobs-wqucd')
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(collection)

const get_yobs = () => db.collection(collection).find({}, { limit: 100}).asArray().catch(console.log)

const ambientLight = new AmbientLight({
	color: [255, 255, 255],
	intensity: 1.0
})

const pointLight1 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-0.144528, 49.739968, 80000]
})

const pointLight2 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-3.807751, 54.104682, 8000]
})


const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2})
 
const initialViewState = {
	latitude: 50.6352755,
	longitude: 4.8634802,
	zoom: 8,
	pitch: 40.5,
	bearing: -27.396674584323023
}

const TOOLTIP_STYLE = {
	padding: '20px',
	background: 'rgba(255, 255, 255, 0.95)',
	color: '#000',
	maxWidth: '300',
	fontSize: '20x',
	fontWeight: '600',
	zIndex: 9
}

const INFOWINDOW_STYLE = {
	position: 'absolute',
    right: 0,
    top: 0,
    width: 344,
    background: '#fff',
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.15)',
    margin: 24,
    padding: '6px 9px',
    height: '80%',
    overflowX: 'hidden',
    overflowY: 'overlay',
	outline: 'none',
	paddingRight: 20,
	paddingLeft: 10
}

const HIDDEN_INFOWINDOW = {
	...INFOWINDOW_STYLE,
	background:'rgba(255, 255, 255, 0)',
	color: 'rgba(255, 255, 255, 0)',
	boxShadow: '0 0 4px rgba(0, 0, 0, 0)'
}

const colorRange = [
	[1, 152, 189],
	[73, 227, 206],
	[216, 254, 181],
	[254, 237, 177],
	[254, 173, 84],
	[209, 55, 78]
]

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
			fake_tooltip: null
		}
	}

	async componentDidMount(){

		const {id } = await client.auth.loginWithCredential(new AnonymousCredential())
		amplitude.getInstance().init(AMPLITUDE_KEY, id)
		amplitude.getInstance().logEvent('New Visit')

		const yobs = await get_yobs()
		const yob = yobs[0]
		this.setState({fake_tooltip: `${yob.title}\n ${yob.city}\n ${yob.salary !== 'N/A' ? yob.salary : ''}` }) 
		this.setState({ data: yobs })
//		document.getElementById('deckgl-wrapper').addEventListener('contextmenu', evt => evt.preventDefault())
	}

	_getTooltip = ({ object }) => {
		object && this.state.tooltip_id !== object.title 
			? this.setState({tooltip_id: object.title, tooltipped: true}, () => amplitude.getInstance().logEvent('Set Tooltip', object)) 
			: null

//		!this.state.tooltipped ? this.setState({ }) : null

		return object 
		? 	{ text:`${object.title}\n ${object.city}\n ${object.salary !== 'N/A' ? object.salary : ''}`, style: TOOLTIP_STYLE }
		:	null
	}
	
	_getInfoWindow = ({ object }) => !this.state.name
		? 
			this.setState(
				{ object: object ? object : {}, cta: !!object }, 
				() => amplitude.getInstance().logEvent('Select Job', object)
			)
		: null

	render() {
		const { object, cta, data, loaded, tooltipped, fake_tooltip } = this.state

		const layers = [
			new ColumnLayer({
				id: 'column-layer',
				data,
				diskResolution: 12,
				radius: 6225,
				extruded: true,
				pickable: true,
				elevationScale: 500,
				getPosition: d => d.centroid,
				getFillColor: d => colorRange[d.category],
				getLineColor: [0, 0, 0],
				getElevation: d => d.value/500,
			})
		]

		const InfoWindow = <div 
			style={ Object.keys(object).length ? INFOWINDOW_STYLE : HIDDEN_INFOWINDOW } 
			tabIndex="0"
		>
			<h2 style={{marginBottom: 8}}> 
				{ object.title } <br/>
				<small> { object.salary !== 'N/A' ? object.salary : `Salary: NA` } </small>
			</h2>

			<p style={{marginTop:0}}>
				<img src="location.png" style={{height:24, display: Object.keys(object).length ? 'initial' : 'none'}}/>
				<i style={{padding:6}}>{ object.address }</i>
			</p>

			<p> 
				<a 
					href={`"${object.website}"`}
					style={{
						fontSize: '1.25em',
						marginBlockStart: '1em',
						marginBlockEnd: '1em',
						marginInline: 0,
						fontWeight: 'bold',
						paddingRight: 5,
						display: Object.keys(object).length ? 'initial' : 'none'
					}}
				>{ object.company },</a> 
				{object.pitch}
			</p>

			<p> <strong>Job Description:</strong> { object.description } </p>

			{
				cta
					?	
						<div style={{margin:16}} align="center">
							<a 
								style={{
									margin: 16,
									color: '#052fBA',
									textTransform: 'uppercase',
									background: '#ffffff',
									padding: 12,
									border: '4px solid #052fBA',
									borderRadius: '6px',
									display: 'inline-block',
									transition: 'all 0.3s ease 0s',
								}} 

								onClick={() => this.setState(
									{name: 'CTA', cta: true},
									() => setTimeout(() => this.setState(
										{name: null}, 
										()=> { 
											window.open(object.link)
											amplitude.getInstance().logEvent('Visit Job', object)
										}), 350)
								)}
							> Go to Job Post </a>
						</div>
					:	null
			}

			<p><strong>Requirements:</strong></p>
			<ul style={{paddingRight:10, paddingLeft: 20}}>
				{(object.requirements || []).map((i, idx) => <li key={idx}>{i}</li>)}
			</ul>
		</div>

		const intro = <div 
			className={`pageloader ${!loaded ? 'is-active' : null}`}
			style={{backgroundColor: '#333',}}
		><span className="title">Finding the best jobs for you...</span></div>

		const onboarding_tooltip = <div 
			className="deck-tooltip" 
			style={{
				zIndex: 9, 
				position: 'absolute', 
				pointerEvents: 'none', 
				color: 'rgb(0, 0, 0)', 
				background: 'rgba(255, 255, 255, 0.95)', 
				padding: 20, 
				display: 'block', 
				fontWeight: 600, 
				transform: 'translate(-1px, -1px)', 
				top: '50%', 
				left: '50%'
			}}
			>{ fake_tooltip }</div>

		const main = <DeckGL
			onContextMenu={event => event.preventDefault()}
			initialViewState={initialViewState}
			getTooltip={this._getTooltip}
			onClick={this._getInfoWindow}
			controller={true}
			layers={layers}
			effects={[lightingEffect]}

		>
			{ InfoWindow }
			<StaticMap 
				onContextMenu={event => event.preventDefault()}
				mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} 
				mapStyle='mapbox://styles/mapbox/dark-v10'
				attributionControl={false}
				onLoad={()=> setTimeout(() => this.setState({loaded: true}), 1000)}
			/>
		</DeckGL>

		return <Fragment>
			{ intro }
			{ !tooltipped ? onboarding_tooltip : null }
			{ main }
		</Fragment>
	}
}


export default App
