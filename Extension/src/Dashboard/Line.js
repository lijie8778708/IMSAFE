import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Vacation extends Component {
  static propTypes = {
    prop: PropTypes,
  }

  render() {
    return (
      <div
        style={{
          width: '550px',
          height: '4px',
          backgroundColor: 'rgb(45, 45, 45)',
          marginRight: '183px',
          marginTop: '8px',
        }}></div>
    )
  }
}
