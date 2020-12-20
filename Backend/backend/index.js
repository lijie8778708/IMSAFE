const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user-routes')
const tripRoutes = require('./routes/trip-routes')
const memberRoutes = require('./routes/member-routes')
const activityRoutes = require('./routes//activity-routes')
const User = require('./models/user')
const socketio = require('socket.io')
const http = require('http')
const {
  getRoomData,
  saveRoomData,
  getAllMessage,
  forTest,
} = require('./controllers/chat-controller')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

// const client = redis.createClient("6379", "127.0.0.1");
// client.on("error", function (error) {
//     console.log(error);
// })
let messages = ['hello 1', 'hello 2', 'hello 3', 'hello 4']
const app = express()
let io
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Specify the Amazon DocumentDB cert

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT')
  next()
})

app.use('/api/users', userRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/activities', activityRoutes)

let secret = 'activescaler'
let sqlInfo

app.post('/api/auth', function (req, res) {
  // receive data and save it to redis

  const { firstname, lastname, email, picture } = req.body

  // 这里是虚拟的数据库， 用一个全局变量json代替数据库的作用。
  // database
  sqlInfo = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    picture: picture,
  }

  // create a token basic on user's information
  // 用户sign up把数据存起来， 然后只返回一个id保证数据安全。
  let token = jwt.sign({ userId: '1' }, secret)
  res.send(token)
})

app.post('/api/verifyToken', function (req, res) {
  let token = req.body.token
  jwt.verify(token, 'extension', (err, decoded) => {
    if (err) {
      console.log(err.message)
    } else {
      console.log(decoded)
      //未来我们会在这里写查找数据库的请求。 根据用户id查。
      User.findById(decoded.id).then((ret) => {
        if (ret === null) {
          res.status(500).json({ message: 'user not found' })
        } else {
          res.status(200).json({ user: ret })
        }
      })
    }
  })
})
app.get('/api/test', function (req, res) {
  forTest('5fcda0057bf1100acb22da4f')
})
mongoose
  .connect(
    `mongodb+srv://lijie8778708:lijie00@cluster0-0ffrt.mongodb.net/imsafe_db`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    var server = app.listen(4000)
    io = socketio(server, {
      cors: {
        origin: '*',
      },
    })

    io.on('connect', (socket) => {
      socket.on('join', async ({ name, room }, callback) => {
        console.log(name + room)
        const { error, user } = addUser({ id: socket.id, name, room })

        if (error) return callback(error)

        socket.join(user.room)

        socket.emit('message', {
          message: await getAllMessage(room),
        })
        io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room),
        })

        callback()
      })

      socket.on('sendMessage', async (message, callback) => {
        const user = getUser(socket.id)
        const icon = await User.findById(user.name)
        io.to(user.room).emit('singleMess', {
          icon: icon.icon_url,
          message: message,
        })
        saveRoomData({ tripId: user.room, userId: user.name, message: message })
        callback()
      })

      socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log('disconnect')
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
