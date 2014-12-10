chrome.browserAction.onClicked.addListener(function callback() {
  // open creator page
  chrome.tabs.create({ url: chrome.extension.getURL('ui/index.html') });
});
