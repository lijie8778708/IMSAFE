import React, { Component } from "react";
import "./App.css";
import NewTripMain from "./NewTrip/NewTripMain";
import Dashboard from "./Dashboard/Dashboard";
import SignUpChrome from "./NewTrip/SignUpChrome";
import moment from "moment";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getUser } from "./API/userAPI";
import { getTripById } from "./API/tripAPI";

/* global chrome */

axios.defaults.baseURL = "http://localhost:4000/api";

class App extends Component {
  constructor() {
    super();
    this.state = {
      dashboard: false,
      currDay: 0,
      expired: false,
    };
    this.handler = this.handler.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get(
      ["dashboard", "currDay", "expired", "token", "expiredDate", "userID"],
      (res) => {
        if (res.expired === undefined) {
          chrome.storage.sync.set(
            { expired: true },
            this.setState({ expired: true })
          );
        } else {
          this.setState({ expired: res.expired });
        }

        if (res.expiredDate !== undefined) {
          let now = moment.now().valueOf();
          if (now > res.expiredDate) {
            console.log("expired");
            chrome.storage.sync.set(
              { expired: true },
              this.setState({ expired: true })
            );
          }
        }

        if (res.dashboard === undefined) {
          chrome.storage.sync.set({ dashboard: false });
        } else {
          if (res.dashboard) {
            if (res.currDay === undefined) {
              console.log("currDay not set, should not happen!!");
            } else {
              this.setState({
                currDay: res.currDay,
                dashboard: true,
              });
            }
          } else {
            this.setState({ dashboard: false });
          }
        }

        if (res.token !== undefined) {
          let decoded = jwt.verify(res.token, "activescaler");
          let expiredDate = moment(decoded.recentLoginTime)
            .add(7, "days")
            .valueOf();

          expiredDate = moment(decoded.recentLoginTime)
            .add(20, "seconds")
            .valueOf();

          const id = decoded.user_id;

          chrome.storage.sync.set(
            {
              userID: id,
              expiredDate: expiredDate,
              expired: false,
            },
            () => {
              if (res.userID !== undefined && res.userID !== id) {
                getUser(id, (res) => {
                  getTripById(res.user.cur_trip, (res) => {
                    chrome.storage.sync.set(
                      {
                        currTripInfo: res.trip,
                        currDay: res.trip.start_time,
                      },
                      () => {
                        if (this.state.dashboard) {
                          this.setState({ dashboard: false }, () => {
                            this.setState({
                              currDay: res.trip.start_time,
                              dashboard: true,
                            });
                          });
                        }
                      }
                    );
                  });
                });
              }
              this.setState({ expired: false });
            }
          );

          chrome.storage.sync.remove("token");
        }
      }
    );
  }

  handler(message) {
    chrome.storage.sync.get("currDay", (res) => {
      if (res.currDay === undefined) {
        console.log("currDay not set, should not happen!!");
      } else {
        if (message === "newTripCreated" || message === "skipNewTrip") {
          chrome.storage.sync.set(
            { dashboard: true },
            this.setState({
              currDay: res.currDay,
              dashboard: true,
            })
          );
          return;
        } else if (message === "left" || message === "right") {
          var oldDate = res.currDay;
          var dirc;
          if (message === "left") {
            dirc = -1;
          } else {
            dirc = 1;
          }
          chrome.storage.sync.set(
            {
              currDay: moment(oldDate)
                .add(dirc, "days")
                .startOf("day")
                .valueOf(),
              dashboard: true,
            },
            this.setState({ dashboard: false }, () => {
              this.setState({
                currDay: moment(oldDate)
                  .add(dirc, "days")
                  .startOf("day")
                  .valueOf(),
                dashboard: true,
              });
            })
          );
        } else if (message === "changeTrip") {
          chrome.storage.sync.get("currTripInfo", (res) => {
            chrome.storage.sync.set(
              {
                currDay: res.currTripInfo.start_time,
                dashboard: true,
              },
              this.setState({ dashboard: false }, () => {
                this.setState({
                  currDay: res.currTripInfo.start_time,
                  dashboard: true,
                });
              })
            );
          });
        }
      }
    });
  }

  render() {
    // chrome.storage.sync.get("currTripInfo", (res) => {
    //   console.log(res.currTripInfo._id);
    //   let tripToken = jwt.sign(res.currTripInfo._id, "activescaler");
    //   let invitationLink = "http://localhost:3000?q=" + tripToken;
    //   console.log(invitationLink);
    // });

    return (
      <div id="main" align="center">
        {this.state.expired && <SignUpChrome />}
        {!this.state.expired && !this.state.dashboard && (
          <NewTripMain handler={this.handler} />
        )}
        {!this.state.expired && this.state.dashboard && (
          <Dashboard
            start={moment(this.state.currDay)
              .startOf("day")
              .add(8, "hours")
              .valueOf()}
            end={moment(this.state.currDay)
              .startOf("day")
              .add(16, "hours")
              .valueOf()}
            handler={this.handler}
          />
        )}
      </div>
    );
  }
}

export default App;
