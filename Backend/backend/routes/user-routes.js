const express = require('express')

const userController = require('../controllers/user-controller')

const router = express.Router()

router.get('/allUser', userController.allUser)

router.put('/', userController.saveUser)

router.get('/email/:email', userController.getUserByEmail)

router.get('/:id', userController.getUserById)

router.post('/', userController.updateUserById)

router.delete('/:id', userController.removeUserById)

module.exports = router
