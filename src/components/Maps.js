/*

https://github.com/uber/react-map-gl/blob/5.2-release/examples/heatmap/src/app.js

import MapGL, {Source, Layer} from 'react-map-gl'
import React, {useState} from 'react'


const MAP_COLORS = [ 
    0, 'rgba(33,102,172,0)',  0.2, 'rgb(103,169,207)', 0.4, 'rgb(209,229,240)', 
    0.6, 'rgb(253,219,199)', 0.8, 'rgb(239,138,98)', 0.9, 'rgb(255,201,101)'
]

const MAX_ZOOM_LEVEL = 9
const HEATMAP_COLOR = ['interpolate', ['linear'], ['heatmap-density'], ...MAP_COLORS]
const heatmapLayer = {
    maxzoom: MAX_ZOOM_LEVEL,
    type: 'heatmap',
    paint: {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
        'heatmap-color': HEATMAP_COLOR,
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
    }
}


const INITIAL_VIEWPORT = { latitude: 40, longitude: -100, zoom: 3, bearing: 0, pitch: 0 }
const MAPBOX_TOKEN = ''
export const HeatMap = ({ locations }) => {
    const [viewport, setViewport] = useState(INITIAL_VIEWPORT) 
    const _onViewportChange = viewport => setViewport(viewport)

    return <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={_onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
    >
        <Source data={locations}>
            <Layer {...heatmapLayer} />
        </Source>
    </MapGL>
}


https://github.com/uber/deck.gl/blob/8.1-release/examples/website/heatmap/app.js#L19

*/


import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import React from 'react'


const MAPBOX_TOKEN = ''
const INITIAL_VIEW_STATE = { longitude: -73.75, latitude: 40.73, zoom: 9, maxZoom: 16 }
export const HeatMap = ({ locations }) => {
    const layer = new HeatmapLayer({
        locations,
        pickable: false,
        id: 'heatmp-layer',
        getPosition: d => [d[0], d[1]],
        getWeight: d => d[2],
        radiusPixels:30,
        threshold:0.03,
        intensity:1
    })

    return <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
    >
        <StaticMap
            reuseMaps
            mapStyle={'mapbox://styles/mapbox/dark-v9'}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
        />
    </DeckGL>
}
