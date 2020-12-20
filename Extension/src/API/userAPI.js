import axios from 'axios'

export const saveUser = (
  { email, name, icon_url, cur_page_time, cur_trip },
  callback
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({
    email,
    name,
    icon_url,
    cur_page_time,
    cur_trip,
  })

  try {
    axios.post('/users/', body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log('not ok')
  }
}

export const getUser = (userId, callback) => {
  try {
    axios.get(`/users/${userId}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}

export const updateUserById = ({ type, user_id, cur_trip }, callback) => {
  //console.log(type)
  //console.log(user_id)
  //console.log(cur_trip)
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  //console.log(user_id)
  const body = JSON.stringify({
    type,
    user_id,
    cur_trip,
  })

  try {
    axios.post('/users', body, config).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}

export const removeUserById = (user_id, callback) => {
  try {
    axios.delete(`/users/${user_id}`).then((res) => {
      callback(res.data)
    })
  } catch (err) {
    console.log(err)
  }
}
