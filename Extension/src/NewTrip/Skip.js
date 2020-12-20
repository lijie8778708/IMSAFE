import React, { Component } from "react";
import Laura from "./Laura";
import { getUser } from "../API/userAPI";
import { getTripsByUserId } from "../API/memberAPI";
import { getTripById } from "../API/tripAPI";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

/* global chrome */

class Skip extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get(["userID", "canSkip"], (res) => {
      let canSkip;
      if (res.canSkip === undefined) {
        const user_id = res.userID;
        getTripsByUserId(user_id, (res) => {
          let count = res.trips.length;
          canSkip = count !== 0;
          if (canSkip) {
            this.setState({ show: true });
            chrome.storage.sync.set({ canSkip: canSkip });
          } else {
            this.props.handler("noTripFound");
          }
        });
      } else {
        this.setState({ show: true });
      }
    });
  }

  handleSubmit(e) {
    if (e.target.value === "No") {
      this.props.handler("addNewTrip");
    } else {
      //this.setState({ show: false });

      chrome.storage.sync.get("userID", (res) => {
        const user_id = res.userID;
        getUser(user_id, (res) => {
          getTripById(res.user.cur_trip, (res) => {
            chrome.storage.sync.set(
              { currTripInfo: res.trip, currDay: res.trip.start_time },
              () => {
                this.props.handler("skipNewTrip");
              }
            );
          });
        });
      });
    }
  }

  render() {
    if (this.state.show) {
      return (
        <div align="center">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Laura
            message={[
              "We've found existing trips",
              "under your account!",
              "Would you like to skip the",
              "process for adding a new trip?",
            ]}
            currentIconClass={"icon-style-normal"}
            currentTitle={"content-title"}
          />
          <br />
          <div align="center" style={{ paddingTop: "30px" }}>
            <input
              type="button"
              value="Yes"
              onClick={this.handleSubmit}
              className="search-location-button"
              style={{
                width: "140px",
              }}
            />
            <br />
            <br />
            <input
              type="button"
              value="No"
              onClick={this.handleSubmit}
              className="search-location-button"
              style={{
                width: "140px",
              }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: "220px" }}>
          <Loader type="Bars" color="#2A74E1" height={150} width={150} />
        </div>
      );
    }
  }
}

export default Skip;
