const Chatroom = require('../models/chatroom')
const Chat = require('../models/chat')
const User = require('../models/user')
const getRoomData = async ({ tripId }) => {
  let room
  let msgs
  try {
    room = await Chatroom.findOne({ tripId: tripId })
    msgs = room.messages
    return msgs
  } catch (err) {
    console.log(err)
  }
}

const getChatById = async (chatId) => {
  let curChat
  let user
  try {
    curChat = await Chat.findById(chatId)
    return { icon: curChat.user_icon, message: curChat.message }
  } catch (err) {
    console.log(err)
  }
}
const saveRoomData = async ({ tripId, userId, message }) => {
  let user
  try {
    user = await User.findById(userId)
  } catch (err) {
    console.log(err)
  }
  const chat = new Chat({
    message_time: new Date().getTime().toFixed(),
    message,
    user_id: userId,
    user_icon: user.icon_url,
  })
  try {
    const retChat = await chat.save()
    const room = await Chatroom.findOne({ tripId })
    room.messages.push(retChat._id)
    await room.save()
  } catch (err) {
    console.log(err)
  }
}

const getAllMessage = async (tripId) => {
  let msgs = []
  const roomdata = await getRoomData({ tripId })
  for (let i = 0; i < roomdata.length; i++) {
    msgs.push(await getChatById(roomdata[i]))
  }
  return msgs
}

const forTest = async (tripId) => {
  let room
  try {
    room = await Chatroom.findOne({ tripId })
    console.log(room)
  } catch (err) {
    console.log(err)
  }
}
exports.getRoomData = getRoomData
exports.saveRoomData = saveRoomData
exports.getAllMessage = getAllMessage
exports.forTest = forTest
