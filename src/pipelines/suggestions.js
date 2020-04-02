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


export const likes_counter = user_id => [
    { $match: { UserID: user_id }}, 
    { $group: { _id: '$Liked', count: { $sum: 1 } } }
]


export const tech_counter = user_id => [
    { $match: { UserID: user_id } }, 
    { $unwind: { path: '$TechStack', preserveNullAndEmptyArrays: false } }, 
    { $group: { _id: '$TechStack', count: { $sum: 1 } } }
]


export const heat_map_aggregate = user_id => [
    { $match: { UserID: user_id } }, 
    { $group: { _id: $Coords, count: { $sum: 1 } } }
]


export const industry_counter = user_id => [
    { $match: { UserID: user_id } }, 
    { $group: { _id: $Industry, count: { $sum: 1 } } }
]


export const salary_array = user_id => [
    { $match: { UserID: user_id } }, 
    { $sort: { Salary: 1 } }, 
    { $group: { _id: 'Salary', count: { $push: '$Salary' } } }
]


export const kanban_array = user_id => [{ $match: { UserID: user_id,  Open: true } }]


export const map_yobIds = user_id => [
    { $match: { UserID: user_id } }, 
    { $group: { _id: Suggestions, yobIds: { $push: '$JobId' } } }
]


export const suggestions_history = user_id => [{ 
    $match: { UserID: user_id, Liked: { $ne: null } } 
}]
