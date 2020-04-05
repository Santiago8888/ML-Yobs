exports = async function(MLocation){
    const db = context.services.get("mongodb-atlas").db("Yobs")
  
    const suggest = user_ml_location => [{
        $geoNear: {
            near: { type: 'Point', coordinates: user_ml_location }, 
            distanceField: 'distance', 
            spherical: true
        }
    }]
  
    const new_suggestions = await db.collection('devYobs').aggregate(suggest(MLocation)).toArray()
    return new_suggestions
  }
  