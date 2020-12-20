const HttpError = require('../models/http-error')
const member = require('../models/member')
const Member = require('../models/member')
const Trip = require('../models/trip')

const saveMember = async (req, res, next) => {
  const { trip_id, user_id } = req.body

  const member = new Member({
    trip_id,
    user_id,
  })
  try {
    await member.save()
  } catch (err) {
    const error = new HttpError('Failed to save member', 500)
    return next(error)
  }

  res.status(200).json({ member })
}

const getAllTrips = async (req, res, next) => {
  let user_id = req.params.id
  console.log(user_id)
  console.log('heereee')
  let trips = []
  try {
    members = await Member.find({ user_id: user_id })
    console.log(members)
    for (let i = 0; i < members.length; i++) {
      const trip = await Trip.findById(members[i].trip_id)
      if (trip.isDeleted) continue
      let temp = { trip_id: trip._id, trip_name: trip.tripname }
      trips.push(temp)
    }
  } catch (err) {
    const error = new HttpError('Failed to find members', 500)
    return next(error)
  }
  res.status(200).json({ trips })
}

const getMembersById = async (req, res, next) => {
  const id = req.params.id

  let member
  try {
    member = await Member.find({ trip_id: id })
  } catch (err) {
    const error = new HttpError('Failed to find member', 500)
    return next(error)
  }
  if (member === null) {
    res.status(500).json({ message: 'Failed to find member' })
    return
  }
  res.status(200).json({ member: member })
}

const removeMemberById = async (req, res, next) => {
  const id = req.params.id
  try {
    let members = await Member.find({ trip_id: id })
    for (let i = 0; i < members.length; i++) {
      members[i].isDeleted = true
      await members[i].save()
    }
  } catch (err) {
    const error = new HttpError('Failed to remove member')
    console.log(err)
    return next(error)
  }
  res.status(200).json({ message: 'member deleted' })
}
exports.saveMember = saveMember
exports.getMembersById = getMembersById
exports.removeMemberById = removeMemberById
exports.getAllTrips = getAllTrips
