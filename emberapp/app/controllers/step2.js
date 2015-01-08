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


/*chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //$('#modal-select').modal('hide');

  switch (request.type) {
    case 'container':
      if (request.action === 'add') {
        _container = request.container;
        _enclosing = request.enclosing;

        //setTimeout(function () { $('#modal-set-container-name').modal('show'); }, 900);
      }
      break;
    case 'field':
      if (request.action === 'add') {
        _field = request.field;

        //setTimeout(function() { $('#modal-set-field-name').modal('show'); }, 900);
      }
      break;
    case 'trigger':
      if (request.action === 'add') {
        var trigger = request.trigger;

        if (trigger === undefined) {
          return;
        }

        // Set trigger in 'observer' object
        if (observer.containers[triggerContainer] === undefined) {
          observer.containers[triggerContainer] = {};
        }
        observer.containers[triggerContainer].trigger = trigger;

        // Set trigger in interface
        $('#ctn-' + triggerContainer + '-trigger').html(trigger);
      }
      break;
  }
});
*/
