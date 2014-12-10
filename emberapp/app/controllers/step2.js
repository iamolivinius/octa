import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onSelectContainer: function() {
      // $('#modal-select').modal('show');
      alert('asdfasdf');

      chrome.windows.getAll(null, function(windows) {
        windows.forEach(function(window) {
          chrome.tabs.getAllInWindow(window.id, function(tabs) {
            tabs.forEach(function(tab) {
              chrome.tabs.sendMessage(tab.id, {
                action: 'selection',
                activate: true,
                mode: 'container'
              }, function() {});
            });
          });
        });
      });
    }
  }
});
