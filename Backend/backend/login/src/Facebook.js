import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import { login } from "./Util";
import fbIcon from "./FacebookIcon.png";

class Facebook extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      picture: "",
      token_type: "facebook",
      token: "",
      tripToken: undefined,
    };
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let id = params.get("q");
    console.log(id);

    if (id !== null) {
      this.setState({ tripToken: id });
    }
  }

  responseFacebook(response) {
    this.setState({ email: "" });
    this.setState({
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
      picture: response.picture.data.url,
      token: response.accessToken,
    });

    login(this.state).then((res) => {
      this.props.handler(res);
    });
  }

  render() {
    return (
      <div align="center" className="page">
        <FacebookLogin
          appId="364669291340458"
          autoLoad={false}
          textButton={"  Sign in with Facebook"}
          cssClass="submit"
          fields="first_name,last_name,email,picture"
          callback={this.responseFacebook}
          icon={
            <img
              style={{
                height: "25px",
                width: "25px",
                verticalAlign: "middle",
                marginRight: "8px",
              }}
              src={fbIcon}
              alt=""
            />
          }
        />
      </div>
    );
  }
}

export default Facebook;
