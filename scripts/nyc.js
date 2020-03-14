/*

    1. Read JSON. (Done)
    2. Init Model. (Done)
    3. Add Salary. (Done)
    4. Parse Description. (Done)
    5. Handle Coordinates. ()
    6. Handle Category.
    7. Save First Documents.
    8. Test Locally.
    9. Save Next Batch (1 K).
    10. Update App.
    11. Deploy.
    12. Save Remaning.

*/


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

const yob_requirements = x => x.replace(/â.¢\t+/gi, '.').replace(/o\t/gi, '').split('.').filter(x=>x.length>1)
    .reduce((d, i) => d = d[0]+i.length < 500 ? [d[0] + i.length, [...d[1], `${i.substring(0,i.length-1)}.`.replace(/\s+/g,' ')]] : d, [0, []])[1]


    


const new_yob = yob => ({
    doc: () => ({
        website: null,
        company: `${capitalize(yob[9])} (${capitalize(yob[20])})`,
        title: yob[12],
        salary: `$${add_comma_separator(yob[16])} - $${add_comma_separator(yob[17])}`,
        address: yob[19],
        description: yob_descriptor(yob[21]),
        requirements: yob_requirements(yob[23]),
        link: yob[25],

        value: Math.round((Number(yob[16]) + Number(yob[17]))/2)
    }),

    print(){ print(this.doc()) }
})

new_yob(data[0]).print()




/*

        "website": null,
        "company_1": 9,
        "title": 12,
        "salary_low": 16,
        "salary_high": 17,
        "address": 19,
        "company_2": 20,
        "description": 21,
        "requirements": 23,
        "link": 25,

*/


/*
const parse_description = description => console.log(description.split('\n').filter(i=>i))
const parse_requirements = description => {}//console.log('--------------------------------------------     --------------------------------------------')
const parse_salary = salary => {}

const retrieve_website = company => {}
const retrieve_coordinates = location => {}

const get_category = title => {}


const yob_model = ({
    name, 
    slug, 
    highConcept,
    yob:{ title, compensation, locationNames, description }
}) => ({
    title: title,
    salary: compensation,
    address: locationNames[0],
    company: name,
    website: retrieve_website(name),
    pitch: highConcept,
    description: parse_description(description),
    link: `https://angel.co/company/${slug}/jobs`,
    requirements: parse_requirements(description),

    category: get_category(),
    value: parse_salary(compensation),
    centroid: retrieve_coordinates(locationNames[0]),
    city: locationNames[0],
    source: 'https://angel.co/',
    hasSalary: parse_salary(compensation) > 0
})


const { data: { talent: { jobSearchResults: { startups: { edges }}}}} = angel_json[0] 
const yobs = edges.map(({ node: { highlightedJobListings, ...edge }}) => yob_model({yob: highlightedJobListings[0], ...edge}))
*/

//print(data[0])
