import React, { Component } from "react";
import Facebook from "./Facebook";
import Google from "./Google";
import img from "./LauraStanding.png";

class SignUp extends Component {
  constructor() {
    super();
    if (localStorage.getItem("email")) {
      this.state = {
        stage: "signUp",
        profileImg: localStorage.getItem("picture"),
        fileName: "Upload image",
        citizenship: "",
        firstName: localStorage.getItem("firstname"),
        lastName: localStorage.getItem("lastname"),
        email: localStorage.getItem("email"),
        password: "",
        errMessageColor: "",
        errMessage: "",
      };
    } else {
      this.state = {
        stage: "signUp",
        profileImg:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        fileName: "Upload image",
        citizenship: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        errMessageColor: "",
        errMessage: "",
      };
    }

    this.signInHandler = this.signInHandler.bind(this);
  }

  signInHandler(res) {
    if (res.color !== undefined) {
      this.setState({ errMessageColor: res.color, errMessage: res.message });
    }
  }

  imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({ profileImg: reader.result });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
    this.setState({ fileName: e.target.files[0].name });
  };

  render() {
    return (
      <div>
        <div
          className="errorMessage"
          style={{
            backgroundColor: this.state.errMessageColor,
          }}
        >
          {this.state.errMessage}
        </div>
        <div className="main">
          <p className="sign" align="center">
            Sign In
          </p>
          <div align="center">
            <img
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                height: "120px",
                width: "120px",
              }}
              src={img}
              alt=""
            />
          </div>
          <input type="hidden" id="sessionData" />
          <Facebook handler={this.signInHandler} /> <br />
          <Google handler={this.signInHandler} /> <br />
          {/* Name: {`${this.state.firstName}   ${this.state.lastName}`} <br />
        email: {this.state.email} <br /><br />
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={this.imageHandler}
        /> */}
          {/* <div>
          <img
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              height: "50px",
              width: "50px",
            }}
            src={this.state.profileImg}
            alt=""
          />
          <label htmlFor="image-upload">{this.state.fileName}</label>
        </div> */}
        </div>
      </div>
    );
  }
}

export default SignUp;
