import React, { Component } from 'react'
import Laura from './Laura'
import NotSure from './NotSure'

class TripName extends Component {
  constructor() {
    super()
    this.state = {
      stage: 'tripName',
      param: '',
      submit: false,
      showError: false,
    }
    this.handleInputValue = this.handleInputValue.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    let body = document.body
    body.style.height = '430px'
  }

  handleInputValue(event) {
    if (event === 'NotSure') {
      this.setState({ param: event })
      this.setState({ submit: true })
    } else {
      this.setState({ param: event.target.value })
    }
  }

  handleSubmit() {
    var value = this.state.param
    if (!value.replace(/\s/g, '').length) {
      this.setState({ showError: true })
      setTimeout(() => {
        this.setState({ showError: false })
      }, 2000)
      return
    }
    this.setState({ submit: true, param: value.trim() })
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
          message={[
            'One last step!',
            'Give your trip a name.',
            "Don't worry, you can",
            'change it later',
          ]}
          currentIconClass={'icon-style-normal'}
          currentTitle={'content-title'}
        />
        <br />
        <input
          autoComplete='off'
          type='text'
          name='param'
          value={this.state.param}
          placeholder='Enter trip name'
          onChange={this.handleInputValue}
          className='search-location-box'
        />
        {this.state.showError && (
          <div className='errorMsg'>
            TripName cannot be empty. Or you can simply select [Maybe Later]
          </div>
        )}
        <div align='center' className='search-location-button-div1'>
          <input
            type='submit'
            className='search-location-button'
            value='next'
            onClick={this.handleSubmit}
          />
        </div>
        <br />
        <div
          align='center'
          className='not-sure-div'
          style={{ paddingTop: '60px' }}>
          <NotSure value={'Maybe Later'} handleInput={this.handleInputValue} />
        </div>
      </div>
    )
  }
}

export default TripName
