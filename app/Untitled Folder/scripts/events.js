chrome.browserAction.onClicked.addListener(function callback(tab) {
  // open creator page
  chrome.tabs.create({url: chrome.extension.getURL('extension/interface/creator.html')});
});
