import React, { Component } from "react";
import Laura from "./Laura";
import Search from "./SearchBox";

class Origin extends Component {
  constructor() {
    super();
    this.state = {
      stage: "origin",
      param: "",
    };
    this.handleInputValue = this.handleInputValue.bind(this);
    let body = document.body;
    body.style.height = "430px";
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
      <div align="center">
        <br />
        <br />
        <br />
        <Laura
          message={["Where are you traveling from?"]}
          currentIconClass={"icon-style-normal"}
          currentTitle={"content-title"}
        />
        <br />
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

export default Origin;
