import React, { Component } from "react";
import Destination from "./Destination";
import FriendCount from "./FriendCount";
import Interests from "./Interests";
import Origin from "./Origin";
import TravelTime from "./TravelTime";
import TripName from "./TripName";
import Ready from "./Ready";
import Invitation from "./Invitation";
import Skip from "./Skip";
import moment from "moment";
import jwt from "jsonwebtoken";
import { saveTrip, getTripById } from "../API/tripAPI";
import { saveMember, getMembersById } from "../API/memberAPI";
import { updateUserById } from "../API/userAPI";

/* global chrome */

class NewTripMain extends Component {
  constructor() {
    super();
    this.state = {
      stage: -1,
      destination: "null",
      origin: "null",
      startDate: "null",
      endDate: "null",
      friendCount: "null",
      interests: [],
      invitation: [],
      tripName: "null",
      ready: false,
    };
    this.handler = this.handler.bind(this);
    this.skiphandler = this.skiphandler.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get("stage", (res) => {
      chrome.storage.sync.get(
        [
          "stage",
          "destination",
          "origin",
          "startDate",
          "endDate",
          "friendCount",
          "interests",
          "invitation",
          "tripName",
        ],
        (res) => {
          if (res.stage !== undefined) {
            for (res.key in res) {
              this.setState({ [res.key]: res[res.key] });
            }
          }
        }
      );
    });
  }

  handler(state) {
    const { stage, param } = state;

    if (stage === "ready") {
      const {
        tripName,
        destination,
        startDate,
        endDate,
        interests,
      } = this.state;

      let start_time;
      let end_time;
      chrome.storage.sync.set(
        {
          currDay: moment(startDate, "MM-DD-YYYY").startOf("day").valueOf(),
        },
        () => {
          start_time = moment(startDate, "MM-DD-YYYY").startOf("day").valueOf();
          end_time = moment(endDate, "MM-DD-YYYY").startOf("day").valueOf();
        }
      );

      chrome.storage.sync.get("userID", (res) => {
        let userID = res.userID;

        saveTrip(
          {
            captainId: userID,
            tripname: tripName,
            destination: destination,
            start_time: start_time,
            end_time: end_time,
            interest: interests,
          },
          (res) => {
            chrome.storage.sync.remove([
              "stage",
              "destination",
              "origin",
              "startDate",
              "endDate",
              "friendCount",
              "interests",
              "invitation",
              "tripName",
            ]);

            let tripID = res.trip_id;

            saveMember({ trip_id: tripID, user_id: userID }, (res) => {});

            updateUserById(
              { type: "trip", user_id: userID, cur_trip: tripID },
              (res) => {}
            );

            // AD
            saveMember(
              { trip_id: tripID, user_id: "5fa8ebd6f4c99f70d0cc9105" },
              (res) => {}
            );

            // DT
            saveMember(
              { trip_id: tripID, user_id: "5fa8ec1df4c99f70d0cc9106" },
              (res) => {
                getMembersById(res.member.trip_id, (res) => {});
              }
            );

            // send invitation here
            console.log(this.state.invitation);
            let tripToken = jwt.sign(tripID, "activescaler");
            let invitationLink = "http://localhost:3000?q=" + tripToken;
            console.log(invitationLink);

            getTripById(tripID, (res) => {
              chrome.storage.sync.set(
                { currTripInfo: res.trip },
                this.setState({ ready: true })
              );
            });
          }
        );
      });
      return;
    }

    if (stage === "travelTime") {
      chrome.storage.sync.set(
        { startDate: state.startDate, endDate: state.endDate },
        () => {
          this.setState({
            startDate: state.startDate,
            endDate: state.endDate,
          });
        }
      );
    } else {
      this.setState({ [stage]: param });
      chrome.storage.sync.set({ [stage]: param }, () => {
        this.setState({ [stage]: param });
      });
    }

    this.setState(
      (prevState) => ({ stage: prevState.stage + 1 }),
      () => {
        chrome.storage.sync.set({ stage: this.state.stage });
      }
    );
  }

  skiphandler(res) {
    if (res === "noTripFound" || res === "addNewTrip") {
      chrome.storage.sync.set({ stage: 1 }, this.setState({ stage: 1 }));
    } else if (res === "skipNewTrip") {
      this.props.handler("skipNewTrip");
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.ready !== prevState.ready) {
      this.props.handler("newTripCreated");
    }
  }

  render() {
    return (
      <div align="center">
        {this.state.stage === 0 && <Skip handler={this.skiphandler} />}
        {this.state.stage === 1 && <Destination handler={this.handler} />}
        {this.state.stage === 2 && <Origin handler={this.handler} />}
        {this.state.stage === 3 && <TravelTime handler={this.handler} />}
        {this.state.stage === 4 && <FriendCount handler={this.handler} />}
        {this.state.stage === 5 && <Interests handler={this.handler} />}
        {this.state.stage === 6 && <Invitation handler={this.handler} />}
        {this.state.stage === 7 && <TripName handler={this.handler} />}
        {this.state.stage === 8 && (
          <Ready destination={this.state.destination} handler={this.handler} />
        )}
      </div>
    );
  }
}
export default NewTripMain;
