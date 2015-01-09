//Consider to change in pageAction?
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.insertCSS(tab.id, {file: 'styles/main.css', runAt: 'document_end'});
  chrome.tabs.executeScript(tab.id, {file: 'bower_components/jquery/dist/jquery.js', runAt: 'document_end'});

  // open creator page
  chrome.tabs.create({ url: chrome.extension.getURL('ui/index.html'), index: (tab.index+1) }, function () {
    chrome.tabs.executeScript(tab.id, {file: 'scripts/contentscript.js', runAt: 'document_end'});
  });
});
