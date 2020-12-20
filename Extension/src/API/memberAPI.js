import axios from 'axios'

export const saveMember = ({ trip_id, user_id }, callback) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({
    trip_id,
    user_id,
  })

  try {
    axios.put('/members', body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}

export const removeMember = (trip_id, callback) => {
  try {
    axios.delete(`/members/${trip_id}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}

export const getMembersById = (trip_id, callback) => {
  try {
    axios.get(`/members/${trip_id}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}

export const getTripsByUserId = (user_id, callback) => {
  try {
    axios.get(`/members/trips/${user_id}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}
