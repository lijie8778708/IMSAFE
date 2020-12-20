import React, { Component } from "react";
import Laura from "./Laura";
/* global chrome */

class SignUpChrome extends Component {
  constructor() {
    super();
    this.state = {
      stage: "signUpRedirect",
      message: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    let body = document.body;
    body.style.height = "430px";
  }

  componentDidMount() {
    chrome.storage.sync.get(["firstTimeLogin"], (res) => {
      let message;
      if (res.firstTimeLogin === undefined) {
        message = [
          "Please start with Sign In!",
          "I'll save your info so you can",
          "access this itinerary later.",
        ];
      } else {
        message = ["Your session has expired!", "Please Sign In again."];
      }
      this.setState({ message: message });
    });
  }

  handleSubmit() {
    chrome.tabs.create({ url: "http://localhost:3000/" });
  }

  render() {
    return (
      <div align="center">
        <br />
        <br />
        <b
          style={{
            fontSize: "xx-large",
            fontWeight: "500",
            color: "rgb(60,60,60)",
            paddingBottom: "20px",
          }}
        >
          Welcome to IMSAFE!
        </b>
        <br />
        <br />
        <br />
        <Laura
          message={this.state.message}
          currentIconClass={"icon-style-normal"}
          currentTitle={"content-title"}
        />
        <br />
        <div align="center" style={{ paddingTop: "30px" }}>
          <input
            type="button"
            value="Sign In"
            id="signUp"
            onClick={this.handleSubmit}
            className="search-location-button"
            style={{
              width: "140px",
            }}
          />
        </div>
      </div>
    );
  }
}

export default SignUpChrome;
