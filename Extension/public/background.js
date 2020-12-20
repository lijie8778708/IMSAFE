chrome.storage.onChanged.addListener((changes, namespace) => {
  for (var key in changes) {
    if (key === "token") {
      chrome.storage.sync.get(["dashboard", "firstTimeLogin"], (res) => {
        if (res.dashboard === false && res.firstTimeLogin === undefined) {
          chrome.storage.sync.set({ stage: 0, firstTimeLogin: false });
        }
      });

      // chrome.tabs.query({ url: "http://localhost:3000/*" }, (tabs) => {
      //   for (var i in tabs) {
      //     chrome.tabs.remove(tabs[i].id);
      //   }
      // });
    }
  }
});
