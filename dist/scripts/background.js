"use strict";chrome.runtime.onInstalled.addListener(function(a){console.log("previousVersion",a.previousVersion)}),chrome.browserAction.setBadgeText({text:"'Allo"}),console.log("'Allo 'Allo! Event Page for Browser Action"),chrome.browserAction.onClicked.addListener(function(){chrome.tabs.create({url:chrome.extension.getURL("extension/interface/creator.html")})});