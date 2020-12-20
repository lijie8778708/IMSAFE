var sessionData = document.getElementById("sessionData");
const key = "Extesion0345ab";

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type == "attributes") {
      let tokenData = sessionData.getAttribute("data-first-name");
      chrome.storage.sync.set({ token: tokenData }, function () {
      });
    }
  });
});

observer.observe(sessionData, {
  attributes: true,
});
