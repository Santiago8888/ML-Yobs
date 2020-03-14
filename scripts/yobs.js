import angel_json from './data/angels.json'


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





























// console.log(yobs.length)
// console.log('startups', startups)
// console.log('promotedResult', promotedResult)


// edges.map(({ node:{ highlightedJobListings}}) => console.log(highlightedJobListings))

//  edges.map(({ node: {
//    name, slug, logoUrl, highConcept, companySize, highlightedJobListings, jobListingsCount
//  } }) => yob_model({}) console.log(name, slug, logoUrl, highConcept, companySize, jobListingsCount, highlightedJobListings[0], highlightedJobListings[0].locationNames[0]))


