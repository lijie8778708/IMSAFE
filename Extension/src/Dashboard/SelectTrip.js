import React, { Component } from "react";
import { updateUserById } from "../API/userAPI";
import { getTripsByUserId } from "../API/memberAPI";
import { getTripById } from "../API/tripAPI";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
/* global chrome */
export default class SelectTrip extends Component {
  constructor() {
    super();
    this.state = {
      current: {},
      trips: [],
      ready: false,
    };
    this.display = this.display.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  display() {
    //console.log('ok')

    if (this.state.ready === false) {
      let load = document.getElementById("loadingTrips");
      if (load.style.display === "none") {
        load.style.display = "block";
      } else {
        load.style.display = "none";
      }
    } else {
      let s = document.getElementsByClassName("option");

      for (let i = 0; i < s.length; i++) {
        if (s[i].style.display === "none") {
          if (
            s[i].getAttribute("trip_id") === this.state.current.trip_id ||
            s[i].getAttribute("trip_id") === "loading"
          )
            continue;
          s[i].style.display = "block";
        } else {
          s[i].style.display = "none";
        }
      }
    }
  }

  onClick(event) {
    event.preventDefault();
    const updateTrip = {
      trip_id: event.target.getAttribute("trip_id"),
      trip_name: event.target.innerHTML,
    };
    this.setState({ current: updateTrip });
    chrome.storage.sync.get("userID", (res) => {
      const user_id = res.userID;
      updateUserById(
        { type: "trip", user_id: user_id, cur_trip: updateTrip.trip_id },
        () => {
          getTripById(updateTrip.trip_id, (res) => {
            chrome.storage.sync.set(
              { currTripInfo: res.trip },
              this.props.handler()
            );
          });
        }
      );
    });
    this.display();
  }

  createUI() {
    return this.state.trips.map((trip, i) => (
      <div
        value={trip.trip_name}
        trip_id={trip.trip_id}
        className="option"
        style={{ display: "none" }}
        onClick={this.onClick}
      >
        {trip.trip_name}
      </div>
    ));
  }

  componentDidMount() {
    chrome.storage.sync.get(["userID", "currTripInfo"], (res) => {
      this.setState({
        current: {
          trip_id: res.currTripInfo._id,
          trip_name: res.currTripInfo.tripname,
        },
      });

      const user_id = res.userID;
      getTripsByUserId(user_id, (res) => {
        this.setState({ trips: res.trips, ready: true });
      });
    });
  }

  componentDidUpdate() {
    let load = document.getElementById("loadingTrips");
    if (this.state.ready && load.style.display === "block") {
      this.display();
    }
  }

  render() {
    return (
      <div
        style={{
          width: "350px",
          height: "50px",
          float: "left",
        }}
      >
        <div
          style={{
            paddingRight: "200px",
            paddingTop: "15px",
          }}
        >
          <div
            id="display"
            onClick={this.display}
            value={this.state.current.trip_name}
          >
            {this.state.current.trip_name}
          </div>
          <div
            trip_id="loading"
            className="option"
            id="loadingTrips"
            style={{ display: "none" }}
          >
            <Loader type="ThreeDots" color="#2A74E1" height={30} width={30} />
          </div>
          {this.createUI()}
        </div>
      </div>
    );
  }
}
