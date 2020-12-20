import React from "react";
import LauraZoomed from "../Assets/LauraZoomed.png";
import LauraStanding from "../Assets/LauraStanding.png";

function Laura(props) {
  let picture;
  if (props.zoomed) {
    picture = LauraZoomed;
  } else {
    picture = LauraStanding;
  }

  let messages;
  messages = props.message.map((item, i) => <div key={i}>{item}</div>);
  return (
    <div
      className={props.currentLayout}
      style={{ display: "flex", flexDirection: "row" }}
    >
      <img className={props.currentIconClass} src={picture} alt="" />
      <div className={props.currentTitle}>{messages}</div>
    </div>
  );
}

export default Laura;
