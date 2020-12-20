import axios from 'axios'

export const saveTrip = (
  { captainId, tripname, destination, start_time, end_time, interest },
  callback
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({
    captainId,
    tripname,
    destination,
    start_time,
    end_time,
    interest,
  })

  try {
    axios.put('/trips', body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}

export const getTripById = (id, callback) => {
  try {
    axios.get(`/trips/${id}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}

export const updateTripById = ({
  trip_id,
  trip_name,
  destination,
  start_time,
  end_time,
  interest,
}, callback) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({
    trip_id,
    trip_name,
    destination,
    start_time,
    end_time,
    interest,
  })

  try {
    axios.post('/trips', body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}

export const removeTripById = (trip_id, callback) => {
  try {
    axios.delete(`/trips/${trip_id}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}
