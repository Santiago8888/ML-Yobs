import data from './data/angel.json'
import fs from 'fs'


const print = x => console.log(x)
const data_discovery = () => {
    print(`Data Length: ${data.length}`)
    print(`Data Object Keys 1: ${Object.keys(data[0])}`)
    
    
    const startup = data[0].data.talent.jobSearchResults.startups.edges[0].node
    print(`Startups Keys: ${Object.keys(startup)}`)
    const keys = [ 
        'id',
        'highlightedJobListings',
        'currentUserHasStarred',
        'name',
        'slug',
        'logoUrl',
        'highConcept',
        'companySize',
        'locationTaggings',
        'badges',
        'applicantsInPastWeek',
        'jobListingsCount'
    ]
    
    keys.map(k => print(`${k}: ${startup[k]}`))
    
    const job = startup.highlightedJobListings[0]
    const location = startup.locationTaggings[0]
    
    print(`Job Keys: ${Object.keys(job)}`)
    print(`Location Keys: ${Object.keys(location)}`)
    
    const job_keys = [
        '__typename',
        'id',
        'autoPosted',
        'description',
        'jobType',
        'liveStartAt',
        'locationNames',
        'primaryRoleTitle',
        'remote',
        'slug',
        'title',
        'compensation',
        'estimatedSalary',
        'equity',
        'usesEstimatedSalary'
    ]
    
    
    const location_keys = [
        'id',
        'displayName',
        '__typename'
    ]
    
    
    job_keys.map(k => print(`${k}: ${job[k]}`))
    location_keys.map(k => print(`${k}: ${location[k]}`))    
}

const write_filtered_jobs = () => {
    const startups = data.map(d =>  d.data.talent.jobSearchResults.startups.edges).flat()
    const jobs = startups.map(({node}) => node.promotedStartup 
        ? node.promotedStartup.highlightedJobListings.map(j=> ({...j, ...node.promotedStartup}))
        : node.highlightedJobListings.map(j=> ({...j, ...node}))
    )
    .flat()
    .map(({highlightedJobListings, ...j}) => j)
    .filter(j => !j.compensation.includes('₹') && j.compensation)
    
    print(`Startups Count: ${startups.length}`)
    print(`Jobs Count: ${jobs.length}`)
    fs.writeFileSync('./scripts/output/angel.json', JSON.stringify(jobs))    
}
