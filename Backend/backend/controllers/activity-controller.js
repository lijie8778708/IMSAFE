const HttpError = require('../models/http-error')
const Activity = require('../models/activity')

const addActivity = async (req, res, next) => {
  const { trip_id, Activities } = req.body

  let createdActivities = []

  for (let i = 0; i < Activities.length; i++) {
    const createdActivity = new Activity({
      trip_id,
      user_id: Activities[i].user_id,
      title: Activities[i].title,
      start_time: Activities[i].start_time,
      end_time: Activities[i].end_time,
      is_confirmed: Activities[i].is_confirmed,
    })
    createdActivities.push(createdActivity)
  }

  for (let i = 0; i < createdActivities.length; i++) {
    try {
      await createdActivities[i].save()
    } catch (err) {
      const error = new HttpError('Failed to save activity')
      console.log(err)
      return next(error)
    }
  }

  res.status(200).json({ message: 'ok' })
}

const removeActivityById = async (req, res, next) => {
  const { activity_ids } = req.body

  try {
    for (let i = 0; i < activity_ids.length; i++) {
      let activity = await Activity.findById(activity_ids[i])
      activity.isDeleted = true
      await activity.save()
    }
  } catch (err) {
    const error = new HttpError('Failed to delete activity')
    return next(error)
  }
  res.status(200).json({ message: 'activity deleted' })
}

const updateActivityById = async (req, res, next) => {
  const { Activities } = req.body
  try {
    for (let i = 0; i < Activities.length; i++) {
      let activity = await Activity.findById(Activities[i].activity_id)
      activity.start_time = Activities[i].start_time
      activity.end_time = Activities[i].end_time
      await activity.save()
    }
  } catch (err) {
    const error = new HttpError('Failed to update activity')
    return next(error)
  }
  res.status(200).json({ message: 'ok' })
}

const getActivityById = async (req, res, next) => {
  const id = req.params.id

  let activity
  try {
    activity = await Activity.findOne({ user_id: id })
  } catch (err) {
    const error = new HttpError('Failed to find activity')
    return next(error)
  }
  if (activity === null || activity.isDeleted) {
    res.status(400).json({ message: 'Activity Not Found' })
  }
  res.status(200).json({ activity: activity })
}

const getActivityByTripId = async (req, res, next) => {
  const id = req.params.id

  let activities
  try {
    activities = await Activity.find({ trip_id: id })
  } catch (err) {
    const error = new HttpError('Failed to find activity')
    return next(error)
  }
  if (activities === null) {
    res.status(400).json({ message: 'Activity Not Found' })
  }
  activities = activities.filter((item) => !item.isDeleted)
  res.status(200).json({ activities })
}

const getActivityByMember = async (req, res, next) => {
  const trip_id = req.params.trip_id
  const user_id = req.params.user_id

  let activities
  try {
    activities = await Activity.find({ trip_id, user_id })
  } catch (err) {
    const error = new HttpError('Failed to find activity')
    return next(error)
  }
  if (activities === null) {
    res.status(400).json({ message: 'Activity Not Found' })
  }

  activities = activities.filter((item) => !item.isDeleted)
  res.status(200).json({ activities: activities })
}

exports.removeActivityById = removeActivityById
exports.addActivity = addActivity
exports.updateActivityById = updateActivityById
exports.getActivityById = getActivityById
exports.getActivityByMember = getActivityByMember
exports.getActivityByTripId = getActivityByTripId
