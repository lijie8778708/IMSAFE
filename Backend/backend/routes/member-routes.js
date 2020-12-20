const express = require('express')

const memberController = require('../controllers/member-controller')

const router = express.Router()

router.put('/', memberController.saveMember)

router.get('/:id', memberController.getMembersById)

router.get('/trips/:id', memberController.getAllTrips)

router.delete('/:id', memberController.removeMemberById)

module.exports = router
