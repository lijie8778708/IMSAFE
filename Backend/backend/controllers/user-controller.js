const HttpError = require('../models/http-error')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const user = require('../models/user')

let secret = 'activescaler'

const saveUser = async (req, res, next) => {
  const { email, username, icon_url, token_type, token, region } = req.body

  let my_token
  let recentLoginTime = new Date()
  const createdUser = new User({
    email,
    name: username,
    icon_url,
    token_type,
    token,
    region,
    recentLoginTime,
  })
  try {
    user = await createdUser.save()
    my_token = jwt.sign({ user_id: user._id, recentLoginTime: user.recentLoginTime.valueOf() }, secret)
  } catch (err) {
    const error = new HttpError('Failed to save user to database', 500)
    return next(error)
  }
  res.send(my_token)
}

const getUserByEmail = async (req, res, next) => {
  const email = req.params.email
  let recentLoginTime = new Date()
  let user
  try {
    user = await User.findOne({ email: email })
    user.recentLoginTime = recentLoginTime
    await user.save()
  } catch (err) {
    return next(error)
  }
  if (user === null) {
    res.status(200).json({ message: 'not found' })
  } else {
    token = jwt.sign({ user_id: user._id, recentLoginTime: user.recentLoginTime.valueOf() }, secret)
    res.send(token)
  }
}

const getUserById = async (req, res, next) => {
  const id = req.params.id

  let user
  try {
    user = await User.findById(id)
  } catch (err) {
    console.log(err)
    const error = new HttpError('Cannot find the user', 500)
    return next(error)
  }
  console.log(user)
  res.status(201).json({ user })
}

//user_id, email, username, icon_url, cur_trip, region
const updateUserById = async (req, res, next) => {
  const { type } = req.body
  let user
  if (type === 'trip') {
    const { user_id, cur_trip } = req.body
    try {
      user = await User.findById(user_id)
      user.cur_trip = cur_trip
      await user.save()
    } catch (err) {
      console.log(err)
      const error = new HttpError('Unable to update', 500)
      return next(error)
    }
  }
  else if(type === "icon_url") {
    const { user_id, icon_url } = req.body
    try {
      user = await User.findById(user_id)
      user.icon_url = icon_url
      await user.save()
    } catch (err) {
      console.log(err)
      const error = new HttpError('Unable to update', 500)
      return next(error)
    }
  }
  // try {
  //   user = await User.findById(user_id)
  //   if (email != null && typeof email != undefined) user.email = email
  //   if (username != null && typeof username != undefined) user.name = username
  //   if (icon_url != null && typeof icon_url != undefined)
  //     user.icon_url = icon_url
  //   if (cur_trip != null && typeof cur_trip != undefined)
  //     user.cur_trip = cur_trip
  //   if (region != null && typeof region != undefined) user.region = region
  //   await user.save()
  // } catch (err) {
  //   console.log(err)
  //   const error = new HttpError('Unable to update', 500)
  //   return next(error)
  // }
  res.status(200).json({ message: 'Updated' })
}

const removeUserById = async (req, res, next) => {
  const id = req.params.id

  let user
  try {
    user = await User.findById(id)
    user.isDeleted = true
    await user.save()
  } catch (err) {
    const error = new HttpError('Failed to remove user', 500)
    return next(error)
  }
  res.status(200).json({ message: 'user deleted' })
}

const allUser = async (req, res, next) => {
  try {
    const users = await User.findOne({ email: 'lijie8778708@gmail.com' })
    res.status(200).json({ users: users })
  } catch (err) {
    console.log(err)
  }
}
exports.saveUser = saveUser
exports.updateUserById = updateUserById
exports.getUserById = getUserById
exports.getUserByEmail = getUserByEmail
exports.removeUserById = removeUserById
exports.allUser = allUser
