export const get_cached_suggestions = user_id => [
    { $match: { UserID: user_id, Liked: null } }
] 


export const get_ranked_cached_suggestions = ({ UserID, MLocation}) => [{
    $geoNear: {
        near: { type: 'Point', coordinates: MLocation }, 
        query: { UserID: UserID, Liked: null }, 
        distanceField: 'MLocation', 
        spherical: true
    }
}]


export const cities_aggregate = [{ $group: { _id: '$City', count: { $sum: 1 } } }]
export const city_yobs = city => [{ $match: {City: city} }]

export const suggest = user_ml_location => [{
    $geoNear: {
        near: { type: 'Point', coordinates: user_ml_location }, 
        distanceField: 'MLocation', 
        spherical: true
    }
}]
