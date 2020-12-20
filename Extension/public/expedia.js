//console.log(location.href.indexOf(".activity-details"));
//console.log(location.href.indexOf("search?"));
//console.log("expedia updated");

if (location.href.indexOf(".activity-details") > -1) {
  fetch(chrome.runtime.getURL("/expedia.html"))
    .then((response) => response.text())
    .then((data) => {
      var click = document.createElement("inject");
      click.innerHTML = data;

      var injectTo = document.querySelector(
        ".uitk-layout-grid-item.uitk-layout-grid-item-columnspan-medium-4.uitk-layout-grid-item-columnspan-large-5.all-y-padding-two.all-x-padding-three"
      );
      injectTo.appendChild(click);
    })
    .then(() => {
      var button = document.getElementById("addToTripActiveScaler");
      var image = document.createElement("img");
      image.src = chrome.runtime.getURL("/AddToTrip.png");
      image.style.borderRadius = button.style.borderRadius;
      image.style.position = "relative";
      image.style.margin = "auto";
      image.style.width = "85%";
      image.style.height = "auto";
      button.appendChild(image);
      button.addEventListener("click", getContent);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getContent() {
  // var i = 2;
  // var location = document.querySelector(
  //   "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(2) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  // );
  // if (location === null) {
  //   location = document.querySelector(
  //     "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(3) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  //   );
  //   i = 3;
  // }
  // if (location === null) {
  //   location = document.querySelector(
  //     "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(4) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  //   );
  //   i = 4;
  // }
  // if (location === null) {
  //   location = document.querySelector(
  //     "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(5) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  //   );
  //   i = 5;
  // }
  // if (location === null) {
  //   location = document.querySelector(
  //     "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(6) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  //   );
  //   i = 6;
  // }
  // if (location === null) {
  //   location = document.querySelector(
  //     "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(7) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  //   );
  //   i = 7;
  // }
  // if (location === null) {
  //   location = document.querySelector(
  //     "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(8) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  //   );
  //   i = 8;
  // }
  // if (location === null) {
  //   location = document.querySelector(
  //     "#app > div:nth-child(1) > div > main > div > div:nth-child(2) > div > section:nth-child(9) > div:nth-child(3) > section > div > div > div > div > div > div > div:nth-child(1) > div > ul"
  //   );
  //   i = 9;
  // }

  // console.log(i);
  // location.style["background-color"] = "#00CED1";

  // var items = location.getElementsByTagName("li");
  // for (var i = 0; i < items.length; ++i) {
  //   console.log(items[i].innerText);
  // }

  var title = document.querySelector(".uitk-type-heading-600");

  chrome.storage.sync.get(
    {
      unscheduled: [], //put defaultvalues if any
    },
    (res) => {
      var newList = res.unscheduled;

      if (!newList.includes(title.innerText)) {
        newList.push(title.innerText);
        console.log(newList);
        chrome.storage.sync.set({
          unscheduled: newList,
        });
      } else {
        console.log("already added");
      }
    }
  );
}
