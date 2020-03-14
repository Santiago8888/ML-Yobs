/*

    1. Read JSON. (Done)
    2. Init Model. (Done)
    3. Add Salary. (Done)
    4. Parse Description. (Done)
    5. Handle Coordinates. ()
    6. Handle Category. ()
    7. Save First Documents (10?)
    8. Test Locally. ()
    9. Save Next Batch (1 K).
    10. Update App. ()
    11. Deploy. ()
    12. Save Remaning. ()

*/


import { data } from '../data/nyc.json'
import axios from 'axios'


const print = x => console.log(x)
const add_comma_separator = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const capitalize = s => s.split(' ').reduce((d, i, idx, l) => 
    d += i.charAt(0).toUpperCase() + 
    i.slice(1).toLowerCase() + 
    `${idx + 1 < l.length ? ' ' :  ''}`, ''
)

const yob_descriptor = x => x.replace(/â|¢\t|o\t/gi, ' ').replace(/ [^\w]{1,2}s /g, '’s ').split('.')
    .reduce((d, i) => d = d[0]+i.length < 500 ? [d[0] + i.length, d[1] + i + '.'] : d, [0, ''])[1].replace(/\s+/g,' ')

const yob_requirements = x => x 
    ? 
        x.replace(/â.¢\t+/gi, '.').replace(/o\t/gi, '').split('.').filter(x=>x.length>1)
        .reduce((d, i) => d = d[0]+i.length < 500 ? [d[0] + i.length, [...d[1], `${i.substring(0,i.length-1)}.`.replace(/\s+/g,' ')]] : d, [0, []])[1]
    :   []


const location_token = '116f5028fcc19b'
const location_settings = address => ({
    async: true,
    crossDomain: true,
    url: encodeURI(`https://us1.locationiq.com/v1/search.php?key=${location_token}&q=${address}&format=json`),
    method: 'GET'
})


const get_location_url = address => `https://us1.locationiq.com/v1/search.php?key=${location_token}&q=${address}&format=json`
const get_coordinates = async yob => {
    const location_url = get_location_url(yob)
    const { data = [{}] } = await axios.get(location_url)
    return [data[0].lat, data[0].lon]
}


const do_get_coordinates = false
const new_yob = async yob => {
    const centroid = do_get_coordinates ? await get_coordinates(`${yob[19]}, New York, USA`) : [0, 0]
    return {
        title: yob[12],
        salary: `$${add_comma_separator(yob[16])} - $${add_comma_separator(yob[17])}`,
        address: yob[19],
        company: `${capitalize(yob[9])} (${capitalize(yob[20])})`,
        website: null,
        pitch: '',
        description: yob_descriptor(yob[21]),
        link: yob[25],
        requirements: yob_requirements(yob[23]),

        category: 'TO DO',
        value: Math.round((Number(yob[16]) + Number(yob[17]))/2),
        centroid: centroid,
        city: capitalize(yob[9]),
        source: 'Open Data',
        hasSalary: true
    }
}

const yob = data[0]
new_yob(yob).then(print)


/*

Make request. (Done)
Retrieve data - lat, lng. (Done)
Create new Collection (N/A)
Store on new New Collection. (N/A)
Retrive coordinates. (N/A)

*/


const get_all_locations = () => [...new Set(data.map((yob, i) => `${new_yob(yob).address}, New York, USA`))]
// const locations = get_all_locations()
