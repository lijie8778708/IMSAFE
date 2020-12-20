const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatSchema = new Schema({
  message_time: { type: Number, required: true },
  message: { type: String, required: true },
  user_id: { type: String, required: true },
  user_icon: { type: String },
  isDeleted: { type: Boolean, default: false },
})

module.exports = mongoose.model('Chat', chatSchema)
