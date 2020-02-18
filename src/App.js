
import { RemoteMongoClient, Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'

import React, { Fragment } from 'react'
import { ColumnLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'

import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZHpldGEiLCJhIjoiY2s2cWFvbjBzMDIzZzNsbnhxdHI5eXIweCJ9.wQflyJNS9Klwff3dxtHJzg'


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
	latitude: 51.01669,
	longitude: 4.7853,
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
    maxHeight: '66%',
    overflowX: 'hidden',
    overflowY: 'overlay',
    outline: 'none',
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
			cta: false
		}
	}

	async componentDidMount(){
		await client.auth.loginWithCredential(new AnonymousCredential())
		const yobs = await get_yobs()
		console.log(yobs)
		this.setState({ data: yobs })
		document.getElementById('deckgl-wrapper').addEventListener('contextmenu', evt => evt.preventDefault())
	}

	_getTooltip = ({ object }) => object 
		? 	{ text:`${object.title} (${object.city})`, style: TOOLTIP_STYLE }
		:	null
	
	_getInfoWindow = ({ object }) => !this.state.name
		? this.setState({ object: object ? object : {}, cta: false })
		: null

	render() {
		const { object, cta, data } = this.state

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
			<h3> Title: { object.title } </h3> 
			<p> <strong>Location:</strong>  { object.location } </p>
			<p> <strong>Salary:</strong> { object.salary } </p>
			
			{	
				cta
				?
					<Fragment>
						<p> <strong>Description:</strong> { object.description } </p>
						<div style={{margin:16}} align="center">
							<a 
								style={{
									margin: 24,
									color: '#052fBA',
									textTransform: 'uppercase',
									background: '#ffffff',
									padding: '20px',
									border: '4px solid #052fBA',
									borderRadius: '6px',
									display: 'inline-block',
									transition: 'all 0.3s ease 0s',
								}} 

								onClick={() => this.setState(
									{name: 'CTA', cta: true}, 
									() => setTimeout(() => 
										this.setState(
											{name: null}, 
											console.log(`https://www.indeed.com.mx/trabajo?q=python&id=${this.state.object.id}`)
										), 500
									)
								)}
							>Go to Job Post</a>
						</div>
					</Fragment>

				:	<a 
						name={'CTA'}
						style={{ color: Object.keys(object).length ? 'blue' :'rgba(255, 255, 255, 0)' }}
						onClick={() => 
							this.setState({name: 'CTA', cta: true}, () => setTimeout(() => this.setState({name: null}), 500))
						}
					>See more...</a>
			}
		</div>


		return (
			<DeckGL
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
				/>
			</DeckGL>
		)
	}
}



export default App
