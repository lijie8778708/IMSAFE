import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { login } from "./Util";
import googleIcon from "./GoogleIcon.png";

class Google extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      picture: "",
      token_type: "google",
      token: "",
      tripToken: undefined,
    };
    this.responseGoogle = this.responseGoogle.bind(this);
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

  responseGoogle(response) {
    this.setState({ email: "" });
    this.setState({
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName,
      email: response.profileObj.email,
      picture: response.profileObj.imageUrl,
      token: response.accessToken,
    });

    login(this.state).then((res) => {
      this.props.handler(res);
    });
  }

  render() {
    return (
      <div align="center">
        <GoogleLogin
          clientId="364131144681-top1osq18c2ia5tqneqlg8s3hjrgk4ba.apps.googleusercontent.com"
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="submit"
            >
              <img
                style={{
                  height: "25px",
                  width: "25px",
                  verticalAlign: "middle",
                  marginRight: "30px",
                }}
                src={googleIcon}
                alt=""
              />
              Sign in with Google
            </button>
          )}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    );
  }
}

export default Google;
