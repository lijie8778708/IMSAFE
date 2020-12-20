import React, { Component } from "react";
import Laura from "./Laura";
import Interest from "./Interest";

class Interests extends Component {
  constructor() {
    super();
    this.state = {
      stage: "interests",
      param: ["Outdoor", "Dining"],
      showError: false,
    };
    this.handleInput = this.handleInput.bind(this);
    let body = document.body;
    body.style.height = "430px";
  }

  handleInput(event) {
    if (event.target.type === "submit") {
      if (this.state.param.length === 0) {
        this.setState({ showError: true });
        setTimeout(() => {
          this.setState({ showError: false });
        }, 1000);
      } else {
        this.setState({ submit: true });
      }
      return;
    }
    if (event.on) {
      this.setState({ param: [...this.state.param, event.value] });
    } else {
      this.setState({
        param: this.state.param.filter((item) => item !== event.value),
      });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.submit !== prevState.submit) {
      this.props.handler(this.state);
    }
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <br />
        <Laura
          message={["What types of activities are", "you interested in?"]}
          currentIconClass={"icon-style-normal"}
          currentTitle={"content-title"}
        />
        <br />
        <div>
          <div align="center" style={{ height: "50px" }}>
            <div align="right" style={{ width: "50%", float: "left" }}>
              <Interest value="Outdoor" handleInput={this.handleInput} />
            </div>
            <div align="left" style={{ width: "50%", float: "left" }}>
              <Interest value="Wellness" handleInput={this.handleInput} />
            </div>
          </div>
          <div align="center">
            <Interest value="Landmarks" handleInput={this.handleInput} />
            <Interest value="Dining" handleInput={this.handleInput} />
            <Interest value="Museums" handleInput={this.handleInput} />
          </div>
          {this.state.showError && (
            <div style={{ width: "60%" }} className="errorMsg">
              You must select at least one Interest.
            </div>
          )}
          <div align="center" style={{ paddingTop: "46px" }}>
            <input
              type="submit"
              value="Next"
              className="search-location-button"
              onClick={this.handleInput}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Interests;
