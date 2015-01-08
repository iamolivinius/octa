import Ember from 'ember';

export default Ember.Controller.extend({

  init: function() {
    chrome.runtime.onMessage.addListener(function(request) {
      if (request.type === "container") {
        this.send('onSelectionReceived', request);
      }
    }.bind(this));
  },

  containers: [],

  actions: {
    onSelectContainer: function() {
      console.log('Select Container Action starts!');
      //Run the Contentscript // switch to latest tab?
      chrome.windows.getAll(null, function(windows) {
        windows.forEach(function(window) {
          chrome.tabs.getAllInWindow(window.id, function(tabs) {
            tabs.forEach(function(tab) {
              chrome.tabs.sendMessage(tab.id, {
                action: 'selection',
                activate: true,
                mode: 'container'
              });
            });
          });
        });
      });
    },
    onRemoveContainer: function(container) {
      this.containers.removeObject(container);
    },
    onSelectionReceived: function(request) {
      if (request.action === 'add') {
        var container = {
          cid :       this.containers.length,
          pattern :   request.container,
          enclosing : request.enclosing
        };
        this.containers.pushObject(container);
      }
    }
  }
});
