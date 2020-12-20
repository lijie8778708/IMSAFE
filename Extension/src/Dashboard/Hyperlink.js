import React, { Component } from "react";

/* global chrome */

export default class Hyperlink extends Component {
  createWindow() {
    chrome.storage.sync.get("currTripInfo", (res) => {
      if (this.props.link === "yelp") {
        chrome.tabs.create({
          url:
            "https://www.yelp.com/search?find_desc=Restaurants&find_loc=" +
            res.currTripInfo.destination,
        });
      } else if (this.props.link === "covid") {
        chrome.tabs.create({
          url:
            "https://www.bing.com/search?q=COVID-19%20Tracker%20" +
            res.currTripInfo.destination,
        });
      }
    });
  }

  render() {
    let color;
    if (this.props.link === "yelp") {
      color = "#F40D15";
    } else if (this.props.link === "covid") {
      color = "#00809D";
    }

    return (
      <div>
        <button
          className="hyperlink"
          style={{ backgroundColor: color }}
          onClick={this.createWindow.bind(this)}
        >
          {this.props.message}
        </button>
      </div>
    );
  }
}
