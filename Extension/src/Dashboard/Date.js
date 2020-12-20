import React, { Component } from "react";
import moment from "moment";

/* global chrome */

export default class Date extends Component {
  constructor() {
    super();
    this.state = {
      start_time: "",
      end_time: "",
    };
  }
  componentDidMount() {
    chrome.storage.sync.get("currTripInfo", (res) => {
      this.setState({
        start_time: moment(res.currTripInfo.start_time).format("MMM Do"),
        end_time: moment(res.currTripInfo.end_time).format("MMM Do"),
      });
    });
  }

  render() {
    return (
      <div>
        <div>{this.state.start_time + " - " + this.state.end_time}</div>
      </div>
    );
  }
}
