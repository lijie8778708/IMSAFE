import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import CalendarData from "./CalendarData";
import Chatbox from "./Chatbox";
import BottomMenu from "./BottomMenu";
import Line from "./Line";
import Vacation from "./Vacation";
import Date from "./Date";
import Location from "./Location";
import create_UUID from "./Util";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

/* global chrome */

let body = document.getElementsByClassName("rct-scroll");
let items = document.getElementsByClassName("rct-item");
let line1 = document.getElementsByClassName("rct-hl-odd");
let line2 = document.getElementsByClassName("rct-hl-even");
let itemContent = document.getElementsByClassName("rct-item-content");
let vls = document.getElementsByClassName("rct-vl");
let sideBar = document.getElementsByClassName("rct-sidebar");
let rctHeader = document.getElementsByClassName("rct-calendar-header");
let rctDateHeader = document.getElementsByClassName("rct-dateHeader");
let root = document.getElementsByClassName("rct-header-root");

// let mainContainer = React.createElement('div', {
//   style: { width: '20px', height: '20px', backgroundColor: 'rgb(255,255,255)' },
// })
// sideBarRow[0].push(mainContainer)

const reRender = () => {
  root[0].style.backgroundColor = "rgb(60,60,60)";
  root[0].style.border = "none";

  for (let i = 0; i < rctDateHeader.length; i++) {
    rctDateHeader[i].style.border = "none";
    rctDateHeader[i].style.backgroundColor = "rgb(60,60,60)";
    rctDateHeader[i].style.color = "white";
    rctDateHeader[i].style.cursor = "default";
  }
  rctHeader[0].style.border = "none";

  // adjust card's css
  for (let i = 0; i < items.length; i++) {
    items[i].style.borderRadius = "1em";
    //items[i][0].style.height = 'none'
    items[i].style.height = "";
    items[i].style.lineHeight = "15px";
    items[i].style.textAlign = "center";
  }

  // vetical line css
  for (let i = 0; i < vls.length; i++) {
    vls[i].style.border = "1px solid";
    vls[i].style.background = "none";
    vls[i].style.backgroundImage =
      "linear-gradient(white 33%, rgba(255, 255, 255, 0) 0%)";
    vls[i].style.backgroundPosition = "right";
    vls[i].style.backgroundSize = "1px 10px";
    vls[i].style.backgroundRepeat = "repeat-y";
  }
  let i = 0,
    j = 0;
  while (i < line1.length || j < line2.length) {
    if (i < line1.length) {
      line1[i++].style.border = "none";
    }
    if (j < line2.length) {
      line2[j++].style.border = "none";
    }
  }
  // content in the card
  for (let i = 0; i < itemContent.length; i++) {
    itemContent[i].style.display = "block";
    itemContent[i].style.fontWeight = "bolder";
    itemContent[i].style.fontSize = "15px";
    itemContent[i].style.height = "45px";
    itemContent[i].style.textOverflow = "ellipsis";
  }

  document.querySelector(
    "#main > div > div.timelineHolder > div > div > div.rct-header-root > div.rct-calendar-header > div:nth-child(1)"
  ).style.height = "25px";

  let rctDateHeaderPrimary = document.querySelector(
    "#main > div > div > div > div > div.rct-header-root > div.rct-calendar-header > div:nth-child(1) > div > span"
  );

  let leftMargin = parseFloat(getComputedStyle(rctDateHeaderPrimary).width);
  leftMargin = 370.0 - leftMargin;
  leftMargin /= 2;
  leftMargin += 200;
  leftMargin += "px";
  rctDateHeaderPrimary.style.position = "fixed";
  rctDateHeaderPrimary.style.left = leftMargin;
};

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

export default class Dashboard extends Component {
  constructor() {
    super();

    let body = document.body;
    let main = document.getElementById("main");
    body.style.height = "0px";
    body.style.width = "780px";
    body.style.border = "none";
    body.style.backgroundColor = "rgb(60,60,60)";
    main.style.backgroundColor = "rgb(60,60,60)";
    main.style.height = "460px";

    this.state = {
      groups: [],
      items: [],
      isCaptain: false,
      captainID: "",
      currentUser: "",
      loading: true,
    };
    // rctHeader[0].style.border = 'none'
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    CalendarData((res) => {
      this.setState({
        groups: res.groups,
        items: res.items,
        isCaptain: res.captainID === res.userID,
        captainID: res.captainID,
        currentUser: res.userID,
      });

      let childs = sideBar[0].firstElementChild.childNodes;
      for (let i = 0; i < childs.length; i++) {
        childs[i].style.color = "white";
        childs[i].style.border = "1px";
        let oDiv;
        let mess = childs[i].textContent;
        //console.log(mess)
        let text;
        if (i === 0) {
          oDiv = React.createElement(
            "div",
            {
              style: {
                fontSize: "18px",
                marginLeft: "-11px",
                fontWeight: "bold",
              },
            },
            "Confirmed Itinerary"
          );
        } else {
          if (i === 1) {
            text = React.createElement(
              "div",
              { style: { fontSize: "11px" } },
              "Captain"
            );
          } else {
            text = React.createElement(
              "div",
              { style: { fontSize: "11px" } },
              "Traveler"
            );
          }

          const pic = React.createElement("img", {
            src: res.groups[i].icon,
            width: "40px",
            height: "40px",
            style: {
              borderRadius: "50%",
              marginTop: "5px",
            },
          });

          const msgDiv = React.createElement(
            "div",
            {
              id: i,
              style: {
                height: "18px",
                fontWeight: "bold",
                textAlign: "center",
              },
            },
            mess
          );
          const div = React.createElement(
            "div",
            {
              style: {
                float: "right",
                marginTop: "-8px",
                width: "115px",
              },
            },
            [msgDiv, text]
          );
          const card = React.createElement("div", {
            style: {
              marginTop: "2px",
              borderRadius: "2em 0 0 2em",
              width: "7px",
              float: "right",
              backgroundColor: res.groups[i].color,
              height: "50px",
            },
          });
          oDiv = React.createElement("div", null, [pic, card, div]);
        }

        ReactDOM.render(oDiv, childs[i]);

        this.setState({ loading: false });
      }
      //console.log(root[0])
      //console.log(root[0].firstElementChild)
      root[0].firstElementChild.className = "dates";
      let dateDiv = document.getElementsByClassName("dates");

      //=========Date===========
      let date = React.createElement(
        "div",
        {
          width: "100px",
          height: "20px",
          style: {
            color: "white",
            textAlign: "left",
          },
        },
        <Date />
      );
      //==========Location===========
      let location = React.createElement(
        "div",
        {
          width: "100px",
          height: "20px",
          style: {
            color: "white",
            textAlign: "left",
          },
        },
        <Location />
      );
      let insertDiv = React.createElement(
        "div",
        { style: { paddingLeft: "20px" } },
        [location, date]
      );
      ReactDOM.render(insertDiv, dateDiv[0]);
    });

    body[0].style.backgroundColor = "black";
    reRender();
    sideBar[0].style.border = "none";
    sideBar[0].firstElementChild.style.backgroundColor = "rgb(60, 60, 60)";
    // sideBar[0].firstElementChild.style.border = '1px solid'
    sideBar[0].firstElementChild.style.backgroundImage =
      "linear-gradient(white 33%, rgba(255, 255, 255, 0) 0%)";
    sideBar[0].firstElementChild.style.backgroundPosition = "right";
    sideBar[0].firstElementChild.style.backgroundSize = "1px 10px";
    sideBar[0].firstElementChild.style.backgroundRepeat = "repeat-y";
    sideBar[0].style.width = "175px";
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    if (itemId.length !== 24) {
      console.log("storage");
    } else {
      console.log("server");
    }

    const { items, isCaptain, captainID } = this.state;

    if (!isCaptain && newGroupOrder !== 2) {
      return;
    }

    let index = items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return;
    }

    const movedItem = items[index];
    //console.log(movedItem);
    const duration = movedItem.end - movedItem.start;
    //console.log(items);

    if (isCaptain) {
      // captain can only move to cofirmed and self
      if (newGroupOrder !== 0 && newGroupOrder !== 1) {
        return;
      }
      // confirmed item cannot be moved out of confirmed
      if (movedItem.group === "0" && newGroupOrder !== 0) {
        return;
      }
      // traveler items can only be move to confirmed
      if (
        movedItem.group !== captainID &&
        movedItem.group !== "0" &&
        newGroupOrder !== 0
      ) {
        return;
      }
      if (movedItem.group !== "0" && newGroupOrder === 0) {
        chrome.storage.sync.get(["newEvents", "currTripInfo"], (res) => {
          let copy = {
            id: create_UUID(),
            title: movedItem.title,
            startTime: dragTime,
            endTime: dragTime + duration,
            isConfirmed: true,
            userID: movedItem.group,
            tripID: res.currTripInfo._id,
          };

          let newList = res.newEvents;

          newList.push(copy);

          chrome.storage.sync.set(
            {
              newEvents: newList,
            },
            this.setState({
              items: [
                ...this.state.items,
                {
                  id: copy.id,
                  group: "0",
                  title: copy.title,
                  start: copy.startTime,
                  end: copy.endTime,
                  itemProps: {
                    style: {
                      minHeight: "50px",
                      maxHeight: "50px",
                    },
                  },
                },
              ],
            })
          );
        });
        return;
      }
    }

    if (itemId.length !== 24) {
      chrome.storage.sync.get(["newEvents"], (res) => {
        let newList = res.newEvents;
        let itemIndex = newList.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
          newList[itemIndex].startTime = dragTime;
          newList[itemIndex].endTime = dragTime + duration;

          //console.log(newList);
          chrome.storage.sync.set({
            newEvents: newList,
          });
        }
      });
    } else {
      chrome.storage.sync.get(["currTripInfo", "updatedEvents"], (res) => {
        let updatedList = res.updatedEvents;
        let updatedListIndex = updatedList.findIndex(
          (item) => item.activity_id === itemId
        );

        if (updatedListIndex !== -1) {
          updatedList[updatedListIndex].start_time = dragTime;
          updatedList[updatedListIndex].end_time = dragTime + duration;
        } else {
          updatedList.push({
            tripID: res.currTripInfo._id,
            activity_id: itemId,
            start_time: dragTime,
            end_time: dragTime + duration,
          });
        }

        chrome.storage.sync.set({
          updatedEvents: updatedList,
        });
      });
    }

    const { groups } = this.state;
    const group = groups[newGroupOrder];
    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            })
          : item
      ),
    });
    //console.log(items);
  };

  handleItemResize = (itemId, time, edge) => {
    if (itemId.length !== 24) {
      console.log("storage");
    } else {
      console.log("server");
    }

    const { items } = this.state;

    if (itemId.length !== 24) {
      chrome.storage.sync.get(["newEvents"], (res) => {
        let newList = res.newEvents;
        let storedIndex = newList.findIndex((item) => item.id === itemId);
        if (storedIndex !== -1) {
          if (edge === "left") {
            newList[storedIndex].startTime = time;
          }
          if (edge === "right") {
            newList[storedIndex].endTime = time;
          }
          chrome.storage.sync.set({
            newEvents: newList,
          });
        }
      });
    } else {
      let index = items.findIndex((item) => item.id === itemId);
      if (index === -1) {
        return;
      }
      const movedItem = items[index];

      chrome.storage.sync.get(["currTripInfo", "updatedEvents"], (res) => {
        let updatedList = res.updatedEvents;
        let updatedListIndex = updatedList.findIndex(
          (item) => item.activity_id === itemId
        );

        if (updatedListIndex !== -1) {
          if (edge === "left") {
            updatedList[updatedListIndex].start_time = time;
          }
          if (edge === "right") {
            updatedList[updatedListIndex].end_time = time;
          }
        } else {
          let startTime, endTime;
          if (edge === "left") {
            startTime = time;
            endTime = movedItem.end;
          }
          if (edge === "right") {
            startTime = movedItem.start;
            endTime = time;
          }

          updatedList.push({
            tripID: res.currTripInfo._id,
            activity_id: itemId,
            start_time: startTime,
            end_time: endTime,
          });
        }

        chrome.storage.sync.set({
          updatedEvents: updatedList,
        });
      });
    }

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time,
            })
          : item
      ),
    });
  };

  handleDoubleClick(itemId, e, time) {
    if (itemId.length !== 24) {
      console.log("storage");
    } else {
      console.log("server");
    }

    //console.log("double click on item " + itemId);

    const { items, isCaptain, captainID, currentUser } = this.state;

    let copy = [...items];

    // console.log(itemId);
    //console.log("items");
    //console.log(items);

    let index = copy.findIndex((item) => item.id === itemId);

    const itemFound = copy[index];

    //console.log(itemFound);

    //console.log(items);

    if (!isCaptain && itemFound.group !== currentUser) {
      return;
    }

    if (isCaptain) {
      if (itemFound.group !== "0" && itemFound.group !== captainID) {
        return;
      }
    }

    const r = window.confirm(
      "Are you sure you want to delete " + itemFound.title + "?"
    );
    if (r === false) {
      return;
    }

    if (itemId.length !== 24) {
      chrome.storage.sync.get(["newEvents"], (res) => {
        let newList = res.newEvents;
        //console.log("chrome");
        //console.log(newList);

        let storedIndex = newList.findIndex((item) => item.id === itemId);
        if (storedIndex !== -1) {
          newList.splice(storedIndex, 1);

          //console.log("chrome after");
          //console.log(newList);

          chrome.storage.sync.set({
            newEvents: newList,
          });
        }
      });
    } else {
      // look in updated list first
      // if any delete
      //
      //
      //
      // add to deleted list
      chrome.storage.sync.get(
        ["currTripInfo", "deletedEvents", "updatedEvents"],
        (res) => {
          let updatedList = res.updatedEvents;
          let updatedListIndex = updatedList.findIndex(
            (item) => item.activity_id === itemId
          );

          if (updatedListIndex !== -1) {
            updatedList.splice(updatedListIndex, 1);
            chrome.storage.sync.set({
              updatedEvents: updatedList,
            });
          }

          let tripID = res.currTripInfo._id;
          let deletedList = res.deletedEvents;
          deletedList.push({ id: itemId, tripID: tripID });
          chrome.storage.sync.set({
            deletedEvents: deletedList,
          });
        }
      );
    }

    if (index !== -1) {
      copy.splice(index, 1);
      this.setState({ items: copy });
    }
  }

  handleRightClick(itemId, e, time) {
    const { items, isCaptain } = this.state;
    if (!isCaptain) {
      return;
    }

    let index = items.findIndex((item) => item.id === itemId);

    const itemFound = items[index];

    if (itemFound.group === "0") {
      return;
    }

    const r = window.confirm(
      "Are you sure add " + itemFound.title + " to Confirmed Itinerary?"
    );
    if (r === false) {
      return;
    }

    chrome.storage.sync.get(["newEvents", "currTripInfo"], (res) => {
      let copy = {
        id: create_UUID(),
        title: itemFound.title,
        startTime: itemFound.start,
        endTime: itemFound.end,
        isConfirmed: true,
        userID: itemFound.group,
        tripID: res.currTripInfo._id,
      };

      let newList = res.newEvents;

      newList.push(copy);

      chrome.storage.sync.set(
        {
          newEvents: newList,
        },
        this.setState({
          items: [
            ...this.state.items,
            {
              id: copy.id,
              group: "0",
              title: copy.title,
              start: copy.startTime,
              end: copy.endTime,
              itemProps: {
                style: {
                  minHeight: "50px",
                  maxHeight: "50px",
                },
              },
            },
          ],
        })
      );
    });
  }

  handlePageZoom = () => {
    reRender();
  };

  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (
      visibleTimeEnd - visibleTimeStart > 72000000 ||
      visibleTimeEnd - visibleTimeStart < 14400000
    ) {
      return;
    }
    //console.log(visibleTimeEnd - visibleTimeStart);

    const minTime = moment(this.props.start).add(-8, "hours").valueOf();
    const maxTime = moment(this.props.end)
      .add(+8, "hours")
      .valueOf();

    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(
        minTime,
        minTime + (visibleTimeEnd - visibleTimeStart)
      );
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(
        maxTime - (visibleTimeEnd - visibleTimeStart),
        maxTime
      );
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  left() {
    this.props.handler("left");
  }

  right() {
    this.props.handler("right");
  }

  changeTrip() {
    this.props.handler("changeTrip");
  }

  componentDidUpdate() {
    reRender();
  }

  render() {
    const { groups, items } = this.state;

    return (
      <div>
        {this.state.loading && (
          <div className="dashboardLoader">
            <div style={{ marginTop: "160px" }}>
              <Loader type="Bars" color="#2A74E1" height={150} width={150} />
            </div>
          </div>
        )}
        <Vacation handler={this.changeTrip.bind(this)} />
        <Line />
        <Chatbox />
        <div className="timelineHolder">
          <button
            className="arrowHolder leftArrow"
            onClick={this.left.bind(this)}
          >
            <i className="arrow left"></i>
          </button>
          <button
            className="arrowHolder rightArrow"
            onClick={this.right.bind(this)}
          >
            <i className="arrow right"></i>
          </button>
          <div style={{ width: "560px" }}>
            <Timeline
              groups={groups}
              items={items}
              keys={keys}
              fullUpdate={true}
              itemTouchSendsClick={false}
              minZoom={4 * 60 * 60 * 1000}
              maxZoom={20 * 60 * 60 * 1000}
              stackItems={false}
              itemHeightRatio={0.92}
              canMove={true}
              canResize={"both"}
              lineHeight={55}
              sidebarWidth={180}
              defaultTimeStart={this.props.start}
              defaultTimeEnd={this.props.end}
              onItemMove={this.handleItemMove.bind(this)}
              onItemResize={this.handleItemResize}
              onZoom={this.handlePageZoom}
              onBoundsChange={this.handlePageZoom}
              onTimeChange={this.handleTimeChange}
              onItemDoubleClick={this.handleDoubleClick.bind(this)}
              onItemContextMenu={this.handleRightClick.bind(this)}
            />
          </div>
        </div>
        <BottomMenu />
      </div>
    );
  }
}
