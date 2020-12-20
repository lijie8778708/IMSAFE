import React, { Component } from "react";
import UserInfo from "./UserInfo";
import SelectTrip from "./SelectTrip";

export default class Vacation extends Component {
  changeTrip() {
    this.props.handler();
  }

  render() {
    return (
      <div
        style={{
          width: "600px",
          height: "56px",
          marginRight: "183px",
        }}
      >
        <SelectTrip
          handler={this.changeTrip.bind(this)}
        />
        <div
          style={{
            width: "200px",
            height: "50px",
            paddingLeft: "350px",
          }}
        >
          <UserInfo />
        </div>
      </div>
    );
  }
}
