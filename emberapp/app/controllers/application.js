import Ember from 'ember';

export default Ember.Controller.extend({
  activeStep: 1,
  port: {},
  tabId: null,

  init: function () {
    chrome.runtime.onConnect.addListener(function(port) {
      console.assert(port.name === 'octa-handshake');
      console.log('incomig message via connect');
      this.set('port', port);
      chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.query({currentWindow: true, index: (tab.index-1)}, function(tabs){
          if (tabs.length === 1){
            this.set('tabId', tabs[0].id);
            console.log(tabs);
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  isStep1: function() {
    return this.get('activeStep') === 1;
  }.property('activeStep'),

  isStep2: function() {
    return this.get('activeStep') === 2;
  }.property('activeStep'),

  isStep3: function() {
    return this.get('activeStep') === 3;
  }.property('activeStep'),

  isStep4: function() {
    return this.get('activeStep') === 4;
  }.property('activeStep'),

  isStep5: function() {
    return this.get('activeStep') === 5;
  }.property('activeStep'),
});
