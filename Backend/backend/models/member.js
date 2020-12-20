const mongoose = require('mongoose')

const Schema = mongoose.Schema

const memberSchema = new Schema({
  trip_id: { type: String, required: true },
  user_id: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Member', memberSchema)
