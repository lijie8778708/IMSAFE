import React, { Component } from "react";
import Hyperlink from "./Hyperlink";
import SaveButton from "./SaveButton";
import AddFriend from "./AddFriend";

export default class BottomMenu extends Component {
  // clear() {
  //   chrome.storage.sync.remove("newEvents");
  // }
  /* <button onClick={this.clear}>ok</button> */
  render() {
    return (
      <div className="bottomMenu">
        <div className="bottomMenu-left">
          <AddFriend />
          <SaveButton />
        </div>
        <div style={{ height: "10px" }}></div>
        <Hyperlink message={"Search on Yelp.com"} link={"yelp"} />
        <Hyperlink message={"Covid-19 Tracker on Bing.com"} link={"covid"} />
      </div>
    );
  }
}
