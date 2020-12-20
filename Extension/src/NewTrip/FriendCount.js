import React, { Component } from 'react'
import Laura from './Laura'
import NotSure from './NotSure'

class FriendCount extends Component {
  constructor() {
    super()
    this.state = {
      stage: 'friendCount',
      param: '',
      value: '0',
      submit: false,
    }
    this.handleInputValue = this.handleInputValue.bind(this)
    this.handleValue = this.handleValue.bind(this)
    let body = document.body
    body.style.height = '430px'
  }

  handleInputValue(event) {
    if (event.target === undefined) {
      this.setState({ param: event, submit: true })
      return
    }
    if (event.target.type === 'submit') {
      this.setState({ param: this.state.value, submit: true })
      return
    }
  }

  handleValue(event) {
    this.setState({ value: event.target.value })
  }

  componentDidUpdate(_, prevState) {
    if (this.state.submit !== prevState.submit) {
      this.props.handler(this.state)
    }
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <br />
        <Laura
          message={['How many friends are you', 'traveling with?']}
          currentIconClass={'icon-style-normal'}
          currentTitle={'content-title'}
        />
        <br />
        <div align='center' style={{ fontSize: '20px', marginTop: '-5px' }}>
          <input
            type='number'
            min='0'
            value={this.state.value}
            onChange={this.handleValue}
            style={{
              width: '40px',
              height: '30px',
              fontSize: '17px',
              border: 'none',
              outline: 'none',
            }}
          />
          other friend{this.state.value !== '1' && 's'}
        </div>
        <div align='center' style={{ paddingTop: '50px' }}>
          <input
            className='search-location-button'
            type='submit'
            value='Next'
            onClick={this.handleInputValue}
          />
        </div>
        <div align='center' style={{ paddingTop: '80px' }}>
          <NotSure value={"I'm not sure"} handleInput={this.handleInputValue} />
        </div>
      </div>
    )
  }
}

export default FriendCount
