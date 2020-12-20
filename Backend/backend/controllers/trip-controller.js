const HttpError = require('../models/http-error')
const Trip = require('../models/trip.js')
const Chatroom = require('../models/chatroom')
const saveTrip = async (req, res, next) => {
  const {
    captainId,
    tripname,
    destination,
    start_time,
    end_time,
    interest,
  } = req.body

  const createdTrip = new Trip({
    captainId,
    tripname,
    destination,
    start_time,
    end_time,
    interest,
  })

  let trip_id
  try {
    const retTrip = await createdTrip.save()
    trip_id = retTrip._id
    const chatroom = new Chatroom({
      tripId: trip_id,
    })
    await chatroom.save()
  } catch (err) {
    const error = new HttpError('Failed to save trip', 500)
    return next(error)
  }
  if (trip_id === null) {
    res.status(500).json({ message: 'something`/s wrong' })
  }
  res.status(200).json({ trip_id })
}

const getTripById = async (req, res, next) => {
  const id = req.params.id

  console.log(id)
  let trip
  try {
    trip = await Trip.findById(id)
  } catch (err) {
    const error = new HttpError('Unable to find trip', 500)
    return next(error)
  }
  if (trip === null) {
    res.status(500).json({ message: 'No trip found' })
  }
  if (trip.isDeleted) {
    res.status(200).json({ message: 'trip deleted' })
  }
  res.status(200).json({ trip })
}

const updateTripById = async (req, res, next) => {
  const {
    trip_id,
    trip_name,
    destination,
    start_time,
    end_time,
    interest,
  } = req.body

  try {
    let trip = await Trip.findById(trip_id)
    if (trip_name != null) trip.tripname = trip_name
    if (destination != null) trip.destination = destination
    if (start_time != null) trip.start_time = start_time
    if (end_time != null) trip.end_time = end_time
    if (interest != null) trip.interest = interest
    await trip.save()
  } catch (err) {
    const error = new HttpError('Unable to find trip', 500)
    return next(error)
  }
  res.status(200).json({ message: 'updated' })
}

const removeTripById = async (req, res, next) => {
  const id = req.params.id
  try {
    const trip = await Trip.findById(id)
    trip.isDeleted = true
    await trip.save()
  } catch (err) {
    const error = new HttpError('Failed to remove trip', 500)
    return next(error)
  }

  res.status(200).json({ message: 'trip deleted' })
}

exports.saveTrip = saveTrip
exports.getTripById = getTripById
exports.updateTripById = updateTripById
exports.removeTripById = removeTripById
