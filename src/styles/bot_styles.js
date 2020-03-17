import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core'

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


export const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2})
 
export const initialViewState = {
//	latitude: 40.69279,
//	longitude: -73.9878993247973,

    latitude: 40.614579,
    longitude: -74.067094, 

	zoom: 11.5,
	pitch: 55.5,
	bearing: 35.396674584323023
}

export const TOOLTIP_STYLE = {
	padding: '20px',
	background: 'rgba(255, 255, 255, 0.95)',
	color: '#000',
	maxWidth: '300',
	fontSize: '20x',
	fontWeight: '600',
	zIndex: 9
}

export const MAP_STYLES = [
	'light-v10',
	'dark-v10',
	'outdoors-v11',
	'satellite-v9'
]


export const INFOWINDOW_STYLE = {
	position: 'absolute',
    right: 0,
    top: 0,
    width: 344,
    background: '#fff',
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.15)',
    margin: 24,
    padding: '6px 9px',
    height: '90%',
    overflowX: 'hidden',
    overflowY: 'overlay',
	outline: 'none',
	paddingRight: 20,
	paddingLeft: 10,
	paddingTop: 10
}


export const colorRange = {
	FrontEnd: [88,81,145], 
	FullStack: [255,126,107], 
	BackEnd: [112,196,70], 
	DevOps: [166,0,103], 
	Data: [247,178,183], 
	Other: [209, 55, 78]
}


export const question_style = {
    fontSize: '1.25em',
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
    marginInline: 0,
    fontWeight: 'bold',
    paddingRight: 0
}

export const primary_button_style = {
    margin: 16,
    color: '#052fBA',
    textTransform: 'uppercase',
    background: '#ffffff',
    padding: 12,
    border: '4px solid #052fBA',
    borderRadius: '6px',
    display: 'inline-block',
    transition: 'all 0.3s ease 0s',
    width: '90%'
}


export const secondary_button_style = {
    margin: 16,
    color: 'indianred',
    textTransform: 'uppercase',
    background: 'rgb(255, 255, 255)',
    padding: 12,
    border: '4px solid indianred',
    borderRadius: 6,
    display: 'inline-block',
    transition: 'all 0.3s ease 0s',
    width: '90%'
}

export const onboarding_tootlip_style = {
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
}