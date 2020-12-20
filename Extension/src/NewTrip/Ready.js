import React, { Component } from 'react'
import Laura from './Laura'

class Ready extends Component {
  constructor() {
    super()
    this.state = {
      stage: 'ready',
      submit: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    let body = document.body
    body.style.height = '430px'
  }

  handleSubmit() {
    this.setState({ submit: true })
  }

  componentDidUpdate(_, prevState) {
    if (this.state.submit !== prevState.submit) {
      this.props.handler(this.state)
    }
  }

  render() {
    var message
    if (this.props.destination === 'NotSure') {
      message = ["Let's start browsing", 'some cities!']
    } else {
      message = ["Let's start browsing the"]
      if (this.props.destination.split(',').length === 1) {
        message.push('beautiful country of')
      } else {
        message.push('beautiful city of')
      }
      message.push(`${this.props.destination.split(',')[0]}!`)
    }

    return (
      <div>
        <br />
        <br />
        <br />
        <Laura
          message={message}
          currentIconClass={'icon-style-normal'}
          currentTitle={'content-title'}
        />
        <div align='center' style={{ paddingTop: '30px' }}>
          <input
            type='submit'
            value={"I'm ready to go!"}
            onClick={this.handleSubmit}
            className='search-location-button'
            style={{
              width: '140px',
            }}
          />
        </div>
      </div>
    )
  }
}

export default Ready
