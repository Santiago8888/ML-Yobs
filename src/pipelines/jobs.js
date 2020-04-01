export const cities_aggregate = [{ $group: { _id: '$City', count: { $sum: 1 } } }]
export const yobs_counter = [{ $group: { _id: 'Total Yobs', count: { $sum: 1 } } }]
export const city_yobs = city => [{ $match: {City: city} }]

export const suggest_pipeline = user_ml_location => [{
    $geoNear: {
        near: { type: 'Point', coordinates: user_ml_location }, 
        distanceField: 'MLocation', 
        spherical: true
    }
}]
