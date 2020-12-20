import axios from "axios";
import jwt from "jsonwebtoken";

axios.defaults.baseURL = "http://localhost:4000/api";

export const login = async ({
  firstName,
  lastName,
  email,
  picture,
  token_type,
  token,
  tripToken,
}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let sessionData = null;
  let newUser = false;
  try {
    let res = await axios.get(`/users/email/${email}`);
    if (res.data.message === "not found") {
      newUser = true;
      const username = firstName + " " + lastName;
      res = await axios.put(
        "/users/",
        JSON.stringify({
          email,
          username,
          icon_url: picture,
          token_type,
          token: token,
          region: "USA",
        }),
        config
      );
    } else {
      let userID;
      jwt.verify(res.data, "activescaler", (err, decoded) => {
        if (err) {
          //console.log(err.message);
        } else {
          userID = decoded.user_id;
        }
      });
      await axios.post(
        "/users",
        JSON.stringify({
          type: "icon_url",
          user_id: userID,
          icon_url: picture,
        }),
        config
      );
    }

    // the res.data contains a token. we saved userid to this token
    sessionData = res.data;
  } catch (err) {
    console.log(err);
  }

  let retMessage;

  if (tripToken !== undefined) {
    let tripID;
    jwt.verify(tripToken, "activescaler", (err, decoded) => {
      if (err) {
        //console.log(err.message);
      } else {
        tripID = decoded;
      }
    });

    try {
      let tripFound = await axios.get(`/trips/${tripID}`);

      if (tripFound.message !== "trip deleted") {
        let members = await axios.get(`/members/${tripID}`);

        let userID;
        jwt.verify(sessionData, "activescaler", (err, decoded) => {
          if (err) {
            console.log(err.message);
          } else {
            userID = decoded.user_id;
          }
        });

        let memberFound = members.data.member.findIndex(
          (updatedItem) => userID === updatedItem.user_id
        );

        if (memberFound === -1) {
          await axios.put(
            "/members",
            JSON.stringify({
              trip_id: tripID,
              user_id: userID,
            }),
            config
          );

          if (newUser) {
            await axios.post(
              "/users",
              JSON.stringify({
                type: "trip",
                user_id: userID,
                cur_trip: tripID,
              }),
              config
            );
          }

          retMessage = {
            color: "#00b36b",
            message:
              "You have successfully joined the trip! Please open the chrome extension to continue.",
          };
        } else {
          retMessage = {
            color: "#ff4d4d",
            message:
              "You have already joined the trip! Please open the chrome extension to continue.",
          };
        }
      } else {
        retMessage = {
          color: "#ff4d4d",
          message: "The trip has already been deleted.",
        };
      }
    } catch (err) {
      retMessage = {
        color: "#ff4d4d",
        message: "The link you have provided is no long valid.",
      };
    }
  } else {
    if (sessionData !== null) {
      if (newUser) {
        retMessage = {
          color: "#00b36b",
          message:
            "Welcome to IMSAFE! Please open the chrome extension to continue.",
        };
      } else {
        retMessage = {
          color: "#00b36b",
          message:
            "Welcome back! Please open the chrome extension to continue.",
        };
      }
    } else {
      retMessage = {
        color: "#ff4d4d",
        message: "We have encounter a problem, please try again later.",
      };
    }
  }

  if (sessionData !== null) {
    document.getElementById("sessionData").dataset.firstName = sessionData;
  }

  return retMessage;
};
