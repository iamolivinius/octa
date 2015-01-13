import Ember from 'ember';

export default Ember.Controller.extend({
  activeStep: 1,
  port: {},
  tabId: null,
  contentTab: null,

  init: function () {
    chrome.tabs.getCurrent(function(tab) {
      this.set('tabId', tab.id);
      chrome.tabs.query({currentWindow: true, index: (tab.index-1)}, function(tabs){
        if (tabs.length === 1){
          this.set('contentTab', tabs[0].id);
          var connection = chrome.tabs.connect(tabs[0].id, {name: 'octa-handshake'});
          this.set('port', connection);
        }
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
