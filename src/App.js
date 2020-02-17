
import {ColumnLayer} from '@deck.gl/layers'
import {StaticMap} from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import React, { Fragment } from 'react'

import './style.scss'


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZHpldGEiLCJhIjoiY2s2cWFvbjBzMDIzZzNsbnhxdHI5eXIweCJ9.wQflyJNS9Klwff3dxtHJzg'


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
	color: 'rgba(255, 255, 255, 0)'
}


const data = [
	{ 
		id: 0,
		value:4.07,
		centroid:[-122.403241,37.79088771],
		vertices:[
			[-122.3993347,37.79178708],
			[-122.4021036,37.79398118],
			[-122.4060099,37.79308171],
			[-122.4071472,37.78998822],
			[-122.4043784,37.78779417],
			[-122.4004722,37.78869356]
		],
		title: 'NodeJS Expert',
		salary: '$78,000',
		location:'Über',
		description: 'Needs expertise as Full Stack'
	}, {
		id: 1,
		value:2.893316195,
		centroid:[-122.4016096,37.78559998],
		vertices:[
			[-122.3977034,37.78649927],
			[-122.4004722,37.78869356],
			[-122.4043784,37.78779417],
			[-122.4055157,37.78470058],
			[-122.402747,37.78250634],
			[-122.398841,37.78340565]
		],
		title: 'Python Data Engineer',
		salary: '$96,000',
		location: 'NASA',
		description: 'Willingness to learn Data Graphs & Hadoop.'
	},
]



class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			object: {},
			name: null,
			cta: false
		}
	}

	componentDidMount() {
//		document.getElementById('deckgl-wrapper').addEventListener('contextmenu', evt => evt.preventDefault())
	}

	_getTooltip = ({ object }) => object 
		? 	{ text:`${object.title}`, style: TOOLTIP_STYLE }
		:	null
	
	_getInfoWindow = ({ object }) => !this.state.name
		? this.setState({ object: object ? object : {}, cta: false })
		: null

	render() {
		const { object, cta } = this.state

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
