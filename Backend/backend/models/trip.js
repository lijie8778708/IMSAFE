const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tripSchema = new Schema({
  captainId: { type: String, required: true },
  tripname: { type: String, required: true },
  destination: { type: String, required: true },
  start_time: { type: Number, required: true },
  end_time: { type: Number, required: true },
  interest: [String],
  isDeleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Trip', tripSchema)
