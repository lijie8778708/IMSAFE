import React, { Component } from 'react'

class NotSure extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    this.props.handleInput('NotSure')
  }

  render() {
    return (
      <input
        type='button'
        value={this.props.value}
        onClick={this.handleSubmit}
        class='not-sure-button'
      />
    )
  }
}

export default NotSure
