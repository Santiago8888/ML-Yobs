/*
    Code From:
    https://github.com/uber/react-vis/blob/master/showcase/plot/big-base-bar-chart.js
    https://github.com/uber/react-vis/blob/master/showcase/plot/line-chart.js
    https://github.com/uber/react-vis/blob/master/showcase/radar-chart/basic-radar-chart.js

    data = [ {id: '00036', y: 200400, x: 1504121437} ]

    Alternative:
    <Line curve={'curveMonotoneX'} data={[{x: 1, y: 3}, {x: 2, y: 5}, {x: 3, y: 15}, {x: 4, y: 12}]} />
*/


import { XAxis, YAxis, XYPlot, VerticalBarSeries, RadarChart } from 'react-vis'
import React from 'react'


const BRACKET_SIZE = 20000
const salary_brackets = [0, 20000, 40000, 60000, 80000, 100000, 120000, 140000, 160000, 180000, 200000]
const axis_style = {fill:'#6b6b76', fontSize:11}

export const SalaryChart = ({ salaries }) =>  <XYPlot 
    yDomain={[ 0, salaries[salaries.length-1] ]}
    margin={{left: 75}}
    width={300} 
    height={300}
>
    <XAxis />
    <YAxis />
    <ChartLabel 
        text="Salary"
        className="alt-x-label"
        includeMargin={false}
        xPercent={0.025}
        yPercent={1.01}
        style={axis_style}
    />

    <ChartLabel 
        text="Frequency"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        style={{ ...axis_style, transform: 'rotate(-90)', textAnchor: 'end' }}
    />
        <VerticalBarSeries data={
            salary_brackets.map(b => ({id:i, x:b, y:salaries.filter(s => b < s && s < b + BRACKET_SIZE ).length }))
        } />
</XYPlot>



export const IndustriesChart = ({ industries }) => <RadarChart
    data={industries}
    startingAngle={0}
    domains={ industries.map(({ _id }) => ({ name: _id, domain: [0, industries[0].count], getValue: d => d[_id].count })) }
    width={300}
    height={300}
/>
