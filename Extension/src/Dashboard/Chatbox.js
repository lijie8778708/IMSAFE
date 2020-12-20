import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { getUser } from "../API/userAPI";
import ChatText from "./ChatText";

/* global chrome */

const ENDPOINT = "http://localhost:4000";
let socket;
const Chatbox = () => {
  const [, setName] = useState("");
  const [, setRoom] = useState("");
  const [, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = React.createRef();

  useEffect(() => {
    chrome.storage.sync.get("userID", (res) => {
      const user_id = res.userID;
      setName(user_id);
      getUser(user_id, (res) => {
        setRoom(res.user.cur_trip);
        socket = io(ENDPOINT);

        socket.emit(
          "join",
          { name: user_id, room: res.user.cur_trip },
          (error) => {
            if (error) {
              alert(error);
            }
          }
        );
        socket.on("message", (message) => {
          for (let i = 0; i < message.message.length; i++) {
            messages.push(message.message[i]);
          }
        });

        socket.on("singleMess", (message) => {
          setMessages((messages) => [...messages, message]);
          messages.push(message);
        });

        socket.on("roomData", ({ users }) => {
          setUsers(users);
        });

        return () => {
          socket.emit("disconnect");

          socket.off();
        };
      });
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    window.scrollTo(0, 0);
  }, createUI);

  const createUI = () => {
    let msgs = [];
    messages.map((mess) => {
      msgs.push(
        <ChatText
          message={mess.message}
          currentIconClass={"icon-style-msg"}
          currentTitle={"content-chat"}
          currentLayout={"margin"}
          icon={mess.icon}
        />
      );
    });
    return msgs;
  };

  return (
    <div className="chatbox">
      <div
        style={{
          marginTop: "20px",
          height: "30px",
          marginLeft: "-100px",
          fontSize: "20px",
        }}
      >
        Chat
      </div>
      <div
        style={{
          height: "400px",
          overflow: "auto",
          paddingLeft: "3px",
          paddingRight: "5px",
        }}
      >
        {createUI()}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ paddingTop: "2px", height: "50px" }}>
        <textarea
          autoComplete="off"
          name="param"
          value={message}
          placeholder="Type Message"
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
          className="search-location-box"
          style={{
            marginTop: "-2px",
            marginLeft: "-2px",
            width: "140px",
            resize: "none",
            borderStyle: "none",
            borderColor: "Transparent",
            borderRadius: "0px",
            overflow: "auto",
            background: "#333333",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "9px",
            color: "white",
            borderBottom: "2px solid #2A74E1",
          }}
        />
        <input
          type="submit"
          className="search-location-button"
          value="Send"
          style={{
            width: "50px",
            height: "26px",
            float: "right",
            marginRight: "6px",
            borderRadius: ".6em",
          }}
          onClick={(event) => sendMessage(event)}
        />
      </div>
    </div>
  );
};

export default Chatbox;
