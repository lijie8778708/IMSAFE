import React, { Component } from "react";
import DatePicker from "./DatePicker";
import Laura from "./Laura";
import { format } from "date-fns";

class TravelTime extends Component {
  constructor() {
    super();
    this.state = {
      stage: "travelTime",
      startDate: "",
      endDate: "",
    };
    this.handleInputValue = this.handleInputValue.bind(this);
    let body = document.body;
    body.style.height = "580px";
  }

  handleInputValue(val) {
    this.setState({
      startDate: format(val.startDate, "MM/dd/yyyy"),
      endDate: format(val.endDate, "MM/dd/yyyy"),
    });
  }

  componentDidUpdate(_, prevState) {
    if (
      this.state.startDate !== prevState.startDate &&
      this.state.endDate !== prevState.endDate
    ) {
      this.props.handler(this.state);
    }
  }

  render() {
    return (
      <div>
        <br />
        <div style={{ marginBottom: "8px" }}>
          <Laura
            message={["When will you be traveling?"]}
            currentIconClass={"icon-style-normal"}
            currentTitle={"content-title"}
          />
        </div>
        <DatePicker handleInput={this.handleInputValue} />
      </div>
    );
  }
}

export default TravelTime;
