import React, { Component } from "react";

class Search extends Component {
  constructor() {
    super();
    this.state = {
      param: "",
      buttons: undefined,
      selected: "",
      chosen: false,
      showError: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ chosen: false });
    const { name, value } = event.target;
    this.setState({ [name]: value });
    this.getQuery(value);
  }

  handleClick(event) {
    const { value } = event.target;
    this.setState({ param: value, chosen: true, error: "" });
  }

  handleSubmit() {
    if (this.state.chosen) this.props.handleInput(this.state.param);
    else {
      this.setState({ showError: true });
      setTimeout(() => {
        this.setState({ showError: false });
      }, 1000);
    }
  }

  getQuery(value) {
    if (value.length > 0) {
      let site = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
      site += value;
      site += ".json?place_type=place&autocomplete=true";
      site +=
        "&access_token=pk.eyJ1IjoibWFya3pjYyIsImEiOiJja2Y3dmpjanowMnF2MnltcjdjMGYxM3EyIn0.n3R2Cvjtb1b-Rnx3JdGxRw";
      fetch(site)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error();
          }
        })
        .then((response) => {
          let row = response.features.map((item, key) => {
            let found = false;
            for (var i = 0; i < item.place_type.length; i++) {
              if (
                item.place_type[i] === "place" ||
                item.place_type[i] === "country" ||
                item.place_type[i] === "region"
              ) {
                found = true;
                break;
              }
            }
            if (found) {
              return (
                <div
                  align="left"
                  key={key}
                  className="search-location-list-option-div"
                >
                  <button
                    onClick={this.handleClick}
                    className="search-location-list-button"
                    value={item.place_name}
                  >
                    {item.place_name}
                  </button>
                </div>
              );
            }
            return undefined;
          });
          this.setState({ buttons: row });
        })
        .catch(function () {
          console.log("error");
        });
    } else {
      this.setState({ buttons: undefined });
    }
  }

  render() {
    return (
      <div align="center">
        <div>
          <div className="search-location-box-div">
            <input
              autoComplete="off"
              type="text"
              name="param"
              value={this.state.param}
              placeholder="Enter a City or Country"
              onChange={this.handleChange}
              className="search-location-box"
            />

            <div className="search-location-list-div ">
              {!this.state.chosen && this.state.buttons}
            </div>
            {this.state.showError && (
              <div style={{ marginTop: "8px" }} className="errorMsg">
                Please input a country or city.
              </div>
            )}
          </div>
        </div>
        <div className={this.props.searchButtonDiv}>
          <input
            className="search-location-button"
            type="button"
            value="Next"
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    );
  }
}

export default Search;
