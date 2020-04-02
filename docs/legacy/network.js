const init_dashboard = async user_id => {
    const total_yobs = await yobsDB.aggregate(yobs_counter).toArray()
    const likes_metrics = await suggestionsDB.aggregate(likes_counter(user_id)).toArray()
    const tech_stack = await suggestionsDB.aggregate(tech_counter(user_id)).toArray()

    const industries = await suggestionsDB.aggregate(industry_counter(user_id)).toArray()
    const location_likes = await suggestionsDB.aggregate(heat_map_aggregate(user_id)).toArray()
    const salary_distribution = await suggestionsDB.aggregate(salary_array(user_id)).toArray()

    return {
        yobs: total_yobs,
        likes: likes_metrics,
        tech: tech_stack,
        industries: industries,
        locations: location_likes,
        salaries: salary_distribution
    }
}

const init_user = async user_id => {
    const inital_location = [0, 0]
    await usersDB.insertOne({ UserID: user_id, MLocation: inital_location}).catch(console.log)
    const suggestions = await yobsDB.aggregate(suggest(inital_location)).toArray()
    return suggestions
}

const get_new_suggestions = ({ MLocation }) =>  await yobsDB.aggregate(suggest(MLocation)).toArray()



const network_requests = async () => {
    const { id: user_id } = await client.auth.loginWithCredential(new AnonymousCredential())
    const suggestions = await suggestionsDB.aggregate(get_ranked_cached_suggestions(user_id)).toArray()
    const user = await usersDB.findOne({ UserID: user_id }).asArray().catch(console.log)

    const new_suggestions = !user
//        ?   await init_user(user_id)
//        :   await get_new_suggestions(user)

    const kanban_cards = await suggestionsDB.aggregate(kanban_array(user_id)).toArray()
//    const dashboard_metrics = await init_dashboard(user_id)

    return {
        suggestions: [...suggestions, new_suggestions], // TODO: Sort by Ranking.
        kanban_cards,
        dashboard_metrics
    }
}
