import React, { Component } from "react";

class Interest extends Component {
  constructor(props) {
    super();

    let selected = false
    if (props.value === "Outdoor" || props.value === "Dining") {
      selected = true
    }
    
    this.state = {
      on: selected,
      value: "",
      target: { type: "" },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.setState((prevState) => ({ on: !prevState.on }));
  }

  componentDidMount() {
    this.setState({ value: this.props.value });
  }

  componentDidUpdate(_, prevState) {
    if (this.state.on !== prevState.on) {
      this.props.handleInput(this.state);
    }
  }

  render() {
    let style;
    if (this.state.on) {
      style = { backgroundColor: "rgb(42, 116, 225)" };
    } else {
      style = { backgroundColor: "white" };
    }
    return (
      <input
        type="button"
        style={style}
        value={this.state.value}
        onClick={this.handleChange}
        className={"interest-card"}
      />
    );
  }
}

export default Interest;
