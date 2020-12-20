import axios from 'axios'

export const saveActivities = ({ trip_id, Activities }, callback) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({
    trip_id,
    Activities,
  })

  try {
    axios.put('/activities', body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}

export const removeActivityById = (activity_ids, callback) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({
    activity_ids,
  })
  try {
    axios.patch(`/activities/`, body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}

export const updateActivityById = (Activities, callback) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({
    Activities,
  })

  try {
    axios.post('/activities', body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}

export const getActivityByMember = ({ trip_id, user_id }, callback) => {
  try {
    axios.get(`/activities/${trip_id}/${user_id}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}
