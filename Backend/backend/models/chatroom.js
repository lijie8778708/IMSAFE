const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatroomSchema = new Schema({
  tripId: { type: String, required: true },
  messages: [String],
})

module.exports = mongoose.model('Chatroom', chatroomSchema)
