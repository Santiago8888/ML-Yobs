
import { RemoteMongoClient, Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'

import React, { Fragment } from 'react'
import { ColumnLayer } from '@deck.gl/layers'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZHpldGEiLCJhIjoiY2s2cWFvbjBzMDIzZzNsbnhxdHI5eXIweCJ9.wQflyJNS9Klwff3dxtHJzg'


const collection = 'Yobs'
const client = Stitch.initializeDefaultAppClient('yobs-wqucd')
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(collection)

const get_yobs = () => db.collection(collection).find({}, { limit: 100}).asArray().catch(console.log)


const initialViewState = {
	longitude: -122.41669,
	latitude: 37.7853,
	zoom: 13,
	pitch: 0,
	bearing: 0
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
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.15)',
    margin: 24,
    padding: '12px 24px',
    maxHeight: '96%',
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
		this.setState({ data: yobs })
		document.getElementById('deckgl-wrapper').addEventListener('contextmenu', evt => evt.preventDefault())
	}

	_getTooltip = ({ object }) => object 
		? 	{ text:`${object.title}`, style: TOOLTIP_STYLE }
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
				radius: 250,
				extruded: true,
				pickable: true,
				elevationScale: 500,
				getPosition: d => d.centroid,
				getFillColor: d => [48, 128, d.value * 255, 255],
				getLineColor: [0, 0, 0],
				getElevation: d => d.value,
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
						<a 
							onClick={() => this.setState(
								{name: 'CTA', cta: true}, 
								() => setTimeout(() => 
									this.setState(
										{name: null}, 
										console.log(`https://www.indeed.com.mx/trabajo?q=python&id=${this.state.object.id}`)
									), 500
								)
							)}
							style={{ color: Object.keys(object).length ? 'blue' : 'rgba(255, 255, 255, 0)' }}
						> Link </a>
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
			>
				{ InfoWindow }
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
