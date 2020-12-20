import React, { Component } from 'react'

/* global chrome */

export default class Location extends Component {
  constructor() {
    super()
    this.state = {
      location: '',
    }
  }
  componentDidMount() {
    chrome.storage.sync.get("currTripInfo", (res) => {
      this.setState({
        location:  res.currTripInfo.destination,
      })
    });
  }
  render() {
    return <div style={{marginBottom: '5px'}}>{this.state.location}</div>
  }
}
