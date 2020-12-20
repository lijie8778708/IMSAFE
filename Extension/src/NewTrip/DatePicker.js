import React, { Component } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

class DatePicker extends Component {
  constructor() {
    super();
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSelect(ranges) {
    this.setState({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  }

  handleSubmit() {
    this.props.handleInput(this.state);
  }

  render() {
    const selectionRange = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      key: "selection",
      color: "#2A74E1",
    };

    return (
      <div align="center">
        <div>
          <DateRange
            editableDateInputs={true}
            onChange={this.handleSelect}
            ranges={[selectionRange]}
            fixedHeight={true}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="button"
            value="Next"
            className="search-location-button"
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker;
