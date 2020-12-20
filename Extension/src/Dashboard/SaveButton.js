import React, { Component } from "react";
import {
  saveActivities,
  removeActivityById,
  updateActivityById,
} from "../API/activityAPI";

/* global chrome */

export default class SaveButton extends Component {
  save() {
    chrome.storage.sync.get(
      ["currTripInfo", "newEvents", "deletedEvents", "updatedEvents"],
      (res) => {
        let tripID = res.currTripInfo._id;

        let newEvents = res.newEvents;
        if (newEvents !== undefined) {
          let activities = [];
          newEvents.forEach((item) => {
            if (item.tripID === tripID) {
              activities.push({
                user_id: item.userID,
                title: item.title,
                start_time: item.startTime,
                end_time: item.endTime,
                is_confirmed: item.isConfirmed,
              });
            }
          });

          console.log("saving " + activities.length + " items");

          if (activities.length !== 0) {
            let newList = newEvents.filter((item) => {
              return tripID !== item.tripID;
            });

            chrome.storage.sync.set({
              newEvents: newList,
            });

            saveActivities(
              {
                trip_id: tripID,
                Activities: activities,
              },
              (res) => {}
            );
          }
        }

        let deletedEvents = res.deletedEvents;
        if (deletedEvents !== undefined) {
          let deletedIDS = [];
          deletedEvents.forEach((item) => {
            if (item.tripID === tripID) {
              deletedIDS.push(item.id);
            }
          });

          console.log("deleting " + deletedIDS.length + " items");

          if (deletedIDS.length !== 0) {
            let deletedList = deletedEvents.filter((item) => {
              return tripID !== item.tripID;
            });

            chrome.storage.sync.set({
              deletedEvents: deletedList,
            });

            removeActivityById(deletedIDS, (res) => {});
          }
        }

        let updatedEvents = res.updatedEvents;
        if (updatedEvents !== undefined) {
          let updatedItems = [];
          updatedEvents.forEach((item) => {
            if (item.tripID === tripID) {
              updatedItems.push(item);
            }
          });

          console.log("updating " + updatedItems.length + " items");

          if (updatedItems.length !== 0) {
            let updatedList = updatedEvents.filter((item) => {
              return tripID !== item.tripID;
            });

            chrome.storage.sync.set({
              updatedEvents: updatedList,
            });

            updateActivityById(updatedItems, (res) => {});
          }
        }
      }
    );
  }

  render() {
    return (
      <div id="saveButton" onClick={this.save}>
        <div id="underline"></div>
        <a href={() => false}>Save Events</a>
      </div>
    );
  }
}
