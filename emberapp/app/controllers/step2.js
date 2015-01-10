import Ember from 'ember';

export default Ember.Controller.extend({
  needs: 'application',
  port: Ember.computed.alias('controllers.application.port'),
  tabId: Ember.computed.alias('controllers.application.tabId'),
  contentTab: Ember.computed.alias('controllers.application.contentTab'),
  containers: [],

  init: function() {
    this.get('port').onMessage.addListener(function(request) {
      if (request.type === "container") {
        this.send('onSelectionReceived', request);
      }
    }.bind(this));
  },

  actions: {
    onSelectContainer: function() {
      console.log('Select Container Action starts!');
      //Run the Contentscript // switch to latest tab?
      this.get('port').postMessage({
        action: 'selection',
        activate: true,
        mode: 'container'
      });
      chrome.tabs.update(this.get('contentTab'), {active: true});
    },
    onRemoveContainer: function(container) {
      this.containers.removeObject(container);
    },
    onSelectionReceived: function(request) {
      if (request.action === 'add') {
        chrome.tabs.update(this.get('tabId'), {active: true});
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
