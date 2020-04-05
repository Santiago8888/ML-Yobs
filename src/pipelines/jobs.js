export const yobs_counter = [{ $group: { _id: 'Total Yobs', count: { $sum: 1 } } }]
