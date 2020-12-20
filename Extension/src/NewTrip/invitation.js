import React, { Component } from "react";
import NotSure from "./NotSure";
import Laura from "./Laura";

class Invitation extends Component {
  constructor() {
    super();
    this.state = {
      stage: "invitation",
      values: [""],
      param: [],
      submit: false,
    };
    this.handleInputValue = this.handleInputValue.bind(this);
  }

  createUI() {
    return this.state.values.map((value, i) => (
      <div key={i} style={{ marginLeft: i !== 0 ? "-20px" : "3px" }}>
        <input
          style={{
            display: i !== 0 ? "inline" : "none",
            border: "none",
            background: "none",
            marginRight: 3,
          }}
          type="button"
          value="X"
          onClick={this.removeClick.bind(this, i)}
        />
        <input
          style={{ marginTop: 8 }}
          type="email"
          value={value || ""}
          onChange={this.handleChange.bind(this, i)}
          className="search-location-box"
        />
      </div>
    ));
  }

  handleChange(i, event) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
  }

  addClick() {
    this.setState((prevState) => ({ values: [...prevState.values, ""] }));
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  handleInputValue(event) {
    if (event.target === undefined) {
      this.setState({ param: [event], submit: true });
      return;
    }
    if (event.target.type === "submit") {
      this.setState({ param: this.state.values, submit: true });
      return;
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.submit !== prevState.submit) {
      this.props.handler(this.state);
    }
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <br />
        <Laura
          message={[
            "Almost there! Invite your travel",
            "buddies to add to trip.",
          ]}
          currentIconClass={"icon-style-normal"}
          currentTitle={"content-title"}
        />
        <br />
        <div
          style={{ maxHeight: "195px", overflow: "auto", position: "relative" }}
        >
          {this.createUI()}
        </div>
        <input
          type="button"
          value="add more"
          onClick={this.addClick.bind(this)}
          className="search-location-button"
          style={{
            marginTop: "20px",
          }}
        />
        <div align="center" className="search-location-button-div1">
          <input
            type="submit"
            className="search-location-button"
            value="next"
            onClick={this.handleInputValue}
          />
        </div>
        <br />
        <div
          align="center"
          className="not-sure-div"
          style={{ paddingTop: "10px" }}
        >
          <NotSure value={"Maybe Later"} handleInput={this.handleInputValue} />
        </div>
      </div>
    );
  }
}

export default Invitation;
