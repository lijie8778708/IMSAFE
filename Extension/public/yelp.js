var tripInfo;
var userID;
chrome.storage.sync.get(["currTripInfo", "userID"], (res) => {
  if (res.currTripInfo !== undefined && res.userID !== undefined) {
    tripInfo = res.currTripInfo;
    userID = res.userID;
    inject();
  }
});

function inject() {
  fetch(chrome.runtime.getURL("/yelp.html"))
    .then((response) => response.text())
    .then((data) => {
      var click = document.createElement("inject");
      click.innerHTML = data;

      var injectTo = document.querySelector(
        ".lemon--div__373c0__1mboc.arrange__373c0__2C9bH.gutter-1__373c0__2l5bx.border-color--default__373c0__3-ifU"
      );

      // console.log(injectTo.childElementCount);
      // if (injectTo.childElementCount > 5) {
      injectTo.after(click);
      document
        .getElementById("addToTripActiveScaler")
        .setAttribute("style", "margin-top: 10px; width: 180.36px;");
      document
        .getElementById("ActiveScalerPopUp")
        .setAttribute("style", "display: none; margin-left: -47.32px;");
      // } else {
      //   var oldChild = injectTo.lastChild;
      //   injectTo.replaceChild(click, oldChild);

      //   document
      //     .getElementById("ActiveScalerPopUp")
      //     .setAttribute("style", "display: none;");

      //   document
      //     .getElementById("addToTripActiveScaler")
      //     .setAttribute("style", "width: 145px;");
      // }

      //console.log(tripInfo);

      const now = new Date(tripInfo.start_time);
      now.setHours(0, 0, 0, 0);
      document.getElementById(
        "ActiveScalerTripStartTime"
      ).defaultValue = now.toISOString().slice(0, -1);
    })
    .then(() => {
      var button = document.getElementById("addToTripActiveScaler");
      var image = document.createElement("img");
      image.src = chrome.runtime.getURL("/ActiveScalerIcon.png");
      image.style.marginRight = "6px";
      image.style.width = "21px";
      image.style.height = "19px";
      image.style.marginTop = "-6px";
      button.prepend(image);
      button.addEventListener("click", getContent);

      var addToItinerary = document.getElementById("ActiveScalerAddButton");
      addToItinerary.addEventListener("click", addItinerary);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getContent() {
  var title = document.querySelector(
    ".lemon--h1__373c0__2ZHSL.heading--h1__373c0__dvYgw.undefined.heading--inline__373c0__10ozy"
  );

  var titleDiv = document.getElementById("ActiveScalerTitle");
  titleDiv.innerHTML = title.innerHTML;

  var location = document.querySelector(".lemon--address__373c0__2sPac");
  // location.style["background-color"] = "#00CED1";

  var locationDiv = document.getElementById("ActiveScalerTripAddress");
  while (locationDiv.firstChild) {
    locationDiv.removeChild(locationDiv.firstChild);
  }
  var items = location.getElementsByTagName("p");
  for (var i = 0; i < items.length; ++i) {
    //console.log(items[i].innerText);
    var p = document.createElement("p");
    p.setAttribute("style", "margin-bottom: 0px;");
    p.innerText = items[i].innerText;
    locationDiv.appendChild(p);
  }

  var popUp = document.getElementById("ActiveScalerPopUp");
  if (popUp.style.display === "none") {
    popUp.style.display = "block";
  } else {
    popUp.style.display = "none";
  }
}

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function addItinerary() {
  var errorDiv = document.getElementById("ActiveScalerErrorMessage");

  var duration = document.getElementById("ActiveScalerTripDuration").value;
  var durationMS = new Date("1970-01-01T" + duration + "Z").getTime();
  if (durationMS < 900000) {
    errorDiv.innerText = "Duration must be at least 15 minutes!";
    return;
  }

  var startTime = document.getElementById("ActiveScalerTripStartTime").value;
  var startTimeMS = Math.floor(new Date(startTime));

  var endtimeMS = startTimeMS + durationMS;
  // console.log(startTimeMS);
  // console.log(endtimeMS);

  var titleText = document.getElementById("ActiveScalerTitle").innerHTML.trim();

  //chrome.storage.sync.remove("newEvents");
  //return;

  chrome.storage.sync.get("currTripInfo", (res) => {
    tripInfo = res.currTripInfo;

    var newActivity = {
      id: create_UUID(),
      title: titleText,
      startTime: startTimeMS,
      endTime: endtimeMS,
      isConfirmed: false,
      userID: userID,
      tripID: tripInfo._id,
    };

    chrome.storage.sync.get(
      {
        newEvents: [],
      },
      (res) => {
        var newList = res.newEvents;

        // for (item in newList) {
        //   console.log(newList[item]);
        // }

        var update = false;
        var add = true;

        for (index in newList) {
          var item = newList[index];
          if (
            item.title === titleText &&
            item.tripID === tripInfo._id &&
            !item.isConfirmed
          ) {
            if (item.startTime === startTimeMS && item.endTime === endtimeMS) {
              errorDiv.innerText =
                titleText + " has already been added to your schedule!";
              errorDiv.setAttribute("style", "color: red;");
              add = false;
            } else {
              newList.splice(index, 1);
              update = true;
            }
            break;
          }
        }

        if (add) {
          newList.push(newActivity);
          chrome.storage.sync.set(
            {
              newEvents: newList,
            },
            () => {
              if (update) {
                errorDiv.innerHTML = "'s schedule been updated!";
              } else {
                errorDiv.innerHTML = " has been added to your schedule!";
              }
              errorDiv.prepend(titleText);
              errorDiv.setAttribute("style", "color: #224084;");
            }
          );
        }
      }
    );
  });
}
