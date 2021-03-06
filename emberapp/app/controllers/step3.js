import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['application', 'step2'],
  port: Ember.computed.alias('controllers.application.port'),
  tabId: Ember.computed.alias('controllers.application.tabId'),
  contentTab: Ember.computed.alias('controllers.application.contentTab'),
  containers: Ember.computed.alias('controllers.step2.containers'),

  init: function() {
    this.get('port').onMessage.addListener(function(request) {
      if (request.type === "trigger") {
        this.send('onTriggerReceived', request);
      }
      else if (request.type === "field") {
        this.send('onFieldReceived', request);
      }
    }.bind(this));
  },

  callSelector: function(mode, container) {
    //Run the Contentscript // switch to latest tab?
    this.get('port').postMessage({
      action: 'selection',
      activate: true,
      mode: mode,
      cid: container
    });
    chrome.tabs.update(this.get('contentTab'), {active: true});
  },

  actions: {
    onSelectTrigger: function(containerId) {
      console.log('Select Trigger Action starts!');
      this.callSelector('trigger', containerId);
    },
    onSelectField: function(containerId) {
      console.log('Select Field Action starts!');
      this.callSelector('field', containerId);
    },
    onRemoveField: function(field) {
      var cs = this.get('containers');
      cs[field.cid].fields.removeObject(field);
      this.set('containers', cs);

    },
    onTriggerReceived: function(request) {
      console.log(request);
      if (request.action === 'add' && request.trigger !== undefined) {
        chrome.tabs.update(this.get('tabId'), {active: true});
        var cs = this.get('containers');
        Ember.set(cs[request.cid], 'trigger', request.trigger);
        this.set('containers', cs);
      }
    },
    onFieldReceived: function(request) {
      console.log(request);
      if (request.action === 'add') {
        chrome.tabs.update(this.get('tabId'), {active: true});

        var cs = this.get('containers');

        if (cs[request.cid].fields === undefined) {
          Ember.set(cs[request.cid], 'fields',[]);
        }
        cs[request.cid].fields.pushObject({
          field : request.field,
          cid   : request.cid
        });
        this.set('containers', cs);
      }
    }
  }
});
