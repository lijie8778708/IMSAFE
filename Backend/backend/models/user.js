const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon_url: { type: String, required: true },
  cur_trip: { type: String },
  recentLoginTime: { type: Date },
  token: { type: String },
  token_type: { type: String },
  region: { type: String, default: 'us' },
  isDeleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('User', userSchema)
