import React, { Component } from 'react'
import { getUser } from '../API/userAPI'
/* global chrome */
export default class UserInfo extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
    }
  }
  componentDidMount() {
    chrome.storage.sync.get('userID', (res) => {
      const user_id = res.userID
      getUser(user_id, (res) => {
        const name = res.user.name.split(' ')
        let first_name = name[0]
        first_name = first_name.replace(
          first_name.slice(0, 1),
          first_name.slice(0, 1).toUpperCase()
        )
        this.setState({ name: first_name })
      })
    })
  }
  render() {
    return (
      <div
        style={{
          width: '350px',
          height: '50px',
          float: 'left',
        }}>
        <div
          style={{
            paddingRight: '100px',
            paddingTop: '15px',
            fontSize: '25px',
            color: 'white',
          }}>
          <label>Hello {this.state.name}</label>
        </div>
      </div>
    )
  }
}
