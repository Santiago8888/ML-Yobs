exports = async function(user){
    const db = context.services.get("mongodb-atlas").db("Yobs")
  
    const get_ranked_cached_suggestions = ({ UserID, MLocation}) => [{
        $geoNear: {
            near: { type: 'Point', coordinates: MLocation }, 
            query: { UserID: UserID, Liked: null }, 
            distanceField: 'MLocation', 
            spherical: true
        }
    }]
    
    
    const suggestions = await db.collection('devSuggestions').aggregate(get_ranked_cached_suggestions(user)).toArray()
    return suggestions
  }
  