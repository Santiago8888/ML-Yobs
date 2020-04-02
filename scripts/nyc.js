/*

    1. Read JSON. (Done)
    2. Init Model. (Done)
    3. Add Salary. (Done)
    4. Parse Description. (Done)
    5. Handle Coordinates. (Done)
    6. Handle Category. (Done)
    7. Save First Documents (Done)
    8. Test Locally. (In Progress)
    9. Save Next Batch. ()
    10. Update App. ()
    11. Deploy. ()
    12. Save Remaning. ()

*/

import { Stitch, RemoteMongoClient, AnonymousCredential } from 'mongodb-stitch-server-sdk'
import axios from 'axios'


import categories from './data/categories'
import titles from './data/titles.json'
import { data } from './data/nyc.json'



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



/*

    Make request. (Done)
    Retrieve data - lat, lng. (Done)
    Create new Collection (N/A)
    Store on new New Collection. (N/A)
    Retrive coordinates. (N/A)

*/

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
    try{
        const { data = [{}] } = await axios.get(location_url)
        return [Number(data[0].lon), Number(data[0].lat)]    
    } catch(e){ return [0, 0]}
}



/*

    Get all Job Titles. (Done)
    Save to JSON. (Done)
    Upload to Drive. (Done)
    Retrieve in Drive. (Done)
    Run Notebook. (Done)
    Create Clusters. (Done)
    Read Clusters. (Done)
    Update Last Method. ()

*/


/*

// Helper functions:
const get_all_titles = () => Promise.all(data.slice(0,330).map(async yob => await new_yob(yob))).then(x => x.map(({ title}) => title))
get_all_titles().then(x => print(x.length))
get_all_titles().then(x => print([...new Set(x)].length))
get_all_titles().then(x => [...new Set(x)].map(t => print(`"${t}",`)))

*/


const classify_title = title => categories[String((titles.find(({title: t}) => t === title) || 'Administrative Assistant').category)]

const new_yob = async (yob, do_get_coordinates=false) => ({
    title: capitalize(yob[12]),
    salary: `$${add_comma_separator(yob[16])} - $${add_comma_separator(yob[17])}`,
    address: yob[19],
    company: `${capitalize(yob[9])} (${capitalize(yob[20])})`,
    website: null,
    pitch: '',
    description: yob_descriptor(yob[21]),
    link: yob[25],
    requirements: yob_requirements(yob[23]),

    category: classify_title(yob[12]),
    value: Math.round((Number(yob[16]) + Number(yob[17]))/2),
    centroid: do_get_coordinates ? await get_coordinates(`${yob[19]}, New York, USA`) : [0, 0],
    city: capitalize(yob[9]),
    source: 'Open Data',
    hasSalary: true,

    version: 2
})


/*
// Main test.
const yob = data[0]
new_yob(yob).then(print)
*/


// Document Saver
const collection = 'Yobs'
const init_client = () => Stitch.initializeDefaultAppClient('yobs-wqucd')

const get_db = async client => {
    await client.auth.loginWithCredential(new AnonymousCredential())
    return client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(collection)
}

const post_one = (new_doc, db) => db.collection(collection).insertOne(new_doc).catch(print)

const save_first_yob = async() => {
    const client = init_client() 
    const db = await get_db(client)
    const yob = await new_yob(data[0])
    post_one(yob , db)
    client.close()
} 


const save_yobs = async yobs => {
    const client = init_client() 
    const db = await get_db(client)
    yobs.map((y, i) => setTimeout(async () => post_one(await new_yob(y, true), db), 1000*i))
    setTimeout(() => client.close(), 1000*(yobs.length + 1))
}


// Save all yobs Helper
const get_yobs_with_unique_locations = () => Promise.all(data.map(async yob => await new_yob(yob, false)))
    .then(x => x.reduce((d, i, idx, l) => d[0].find(j => i.address === j.address) ? d : [[...d[0], i], [...d[1], idx]], [[],[]])[1])


get_yobs_with_unique_locations().then(x => save_yobs(x.reduce((d, i) => [...d, data[i]], [])))
