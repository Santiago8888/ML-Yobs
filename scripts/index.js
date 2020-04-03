import yobs from './output/angel.json'
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


const write_for_pandas = () => {
    const salary_regex = /\$|£|€|%|–| /g
    const parse_salary = (y, idx) => Number(y.compensation.replace(salary_regex,'').split('k')[idx])
    const parse_equity = (y, idx) =>  y.equity && y.equity.includes('%') ? Number(y.equity.replace(/%/g, '').split(' – ')[idx]) : 0
    const yob = y => ({
        provider: 'Angel.co',
        id: Number(y.id),
        description: y.description.split('\n').filter(x=>x),
        date: y.liveStartAt,
        datePosted: new Date(y.liveStartAt*1000),
        location: y.locationNames[0],
        title: y.primaryRoleTitle,
        link: `https://angel.co/company/${y.slug}/jobs`,
        minSalary: parse_salary(y, 0),
        maxSalary: parse_salary(y, 1),
        minEquity: parse_equity(y, 0),
        maxEquity: parse_equity(y, 1),
        salary: (parse_salary(y, 0) + parse_salary(y, 1))/2,
        equity: (parse_equity(y, 0) + parse_equity(y, 1))/2,
        compensation: y.compensation,
        name: y.name,
        logo: y.logoUrl,
        pitch: y.highConcept,
        size: y.companySize,
        locationsIdx: (y.locationTaggings || []).length,
        applicantsIdx: y.applicantsInPastWeek,
        jobsIdx: y.jobListingsCount || 0
    })
    
    
    const yob_array = y => [
        y.provider,
        y.id,
        y.description,
        y.date,
        y.datePosted,
        y.location,
        y.title,
        y.link,
        y.minSalary,
        y.maxSalary,
        y.minEquity,
        y.maxEquity,
        y.salary,
        y.equity,
        y.compensation,
        y.name,
        y.logo,
        y.pitch,
        y.size,
        y.locationsIdx,
        y.applicantsIdx,
        y.jobsIdx
    ]
    
    
    const headers = [
        'provider',
        'id',
        'description',
        'date',
        'datePosted',
        'location',
        'title',
        'link',
        'minSalary',
        'maxSalary',
        'minEquity',
        'maxEquity',
        'salary',
        'equity',
        'compensation',
        'name',
        'logo',
        'pitch',
        'size',
        'locationsIdx',
        'applicantsIdx',
        'jobsIdx'
    ]
    
    
    const yobs_array = [
        headers,
        ...yobs.map(y=> yob_array(yob(y)))
    ]
    
    console.log(yobs_array.length)
    fs.writeFileSync('./scripts/output/angel_V1.json', JSON.stringify(yobs_array))
}
