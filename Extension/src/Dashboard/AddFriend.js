import React, { Component } from "react";
import AddFriendImg from "../Assets/AddFriendButton.png";

export default class AddFriend extends Component {
  addFriend() {
    console.log("add friend clickded");
  }

  render() {
    return (
      <div>
        <button className="addFriendButton" onClick={this.addFriend.bind(this)}>
          <img className="addFriendImage" src={AddFriendImg} alt="" />
        </button>
      </div>
    );
  }
}
