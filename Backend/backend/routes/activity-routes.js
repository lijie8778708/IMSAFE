const express = require('express')

const activityController = require('../controllers/activity-controller')

const router = express.Router()

router.put('/', activityController.addActivity)

router.post('/', activityController.updateActivityById)

router.get('/:id', activityController.getActivityById)

router.get('/:trip_id/:user_id', activityController.getActivityByMember)

router.get('/trip/:id', activityController.getActivityByTripId)

router.patch('/', activityController.removeActivityById)

module.exports = router
