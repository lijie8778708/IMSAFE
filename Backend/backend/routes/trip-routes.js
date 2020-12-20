const express = require('express')

const tripController = require('../controllers/trip-controller')

const router = express.Router()

router.put('/', tripController.saveTrip)

router.get('/:id', tripController.getTripById)

router.post('/', tripController.updateTripById)

router.delete('/:id', tripController.removeTripById)

module.exports = router
