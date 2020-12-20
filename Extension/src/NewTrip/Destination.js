import React, { Component } from "react";
import Laura from "./Laura";
import Search from "./SearchBox";

class Destination extends Component {
  constructor() {
    super();
    this.state = {
      stage: "destination",
      param: "",
    };
    this.handleInputValue = this.handleInputValue.bind(this);
  }

  handleInputValue(val) {
    this.setState({ param: val });
  }

  componentDidUpdate(_, prevState) {
    if (this.state.param !== prevState.param) {
      this.props.handler(this.state);
    }
  }

  render() {
    return (
      <div align="center" style={{ marginTop: "20px" }}>
        <br />
        <br />
        <br />
        <br />
        <Laura
          zoomed={true}
          message={[
            "My name is Laura!",
            "I'm here to help you",
            "plan your next getaway.",
          ]}
          currentIconClass={"icon-style-intro"}
          currentTitle={"intro-title"}
        />
        <div className="intro-text-font">
          <p>Where do you want to travel to?</p>
        </div>
        <div>{this.state.param}</div>
        <div>
          <Search
            handleInput={this.handleInputValue}
            searchButtonDiv={"search-location-button-div1"}
          />
        </div>
      </div>
    );
  }
}

export default Destination;
