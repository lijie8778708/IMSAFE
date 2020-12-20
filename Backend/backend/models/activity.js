const mongoose = require('mongoose')

const Schema = mongoose.Schema

const activitySchema = new Schema({
  trip_id: { type: String, required: true },
  user_id: { type: String, required: true },
  is_confirmed: { type: Boolean, default: false },
  title: { type: String, required: true },
  start_time: { type: Number, required: true },
  end_time: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Activity', activitySchema)
