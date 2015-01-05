import Ember from 'ember';

export default Ember.Controller.extend({

  init: function() {
    // chrome.runtime.onMessage.addListener(function() {
    //   console.log('processing message in ember');
    //   this.send('onMessageReceived', {ASDF: "ASDF"});
    // }.bind(this));
    this.send('onSelectionReceived', {container: '<div></div>', enclosing: '<span></span>', action: 'add'});
    this.send('onSelectionReceived', {container: '<div><div><div></div></div></div>', enclosing: '<p></p>', action: 'add'});
  },

  containers: [],

  actions: {
    onSelectContainer: function() {
      console.log('qwerqwedr');
      // Run the Contentscript // switch to latest tab?
      // $('#modal-select').modal('show');
      // chrome.windows.getAll(null, function(windows) {
      //   windows.forEach(function(window) {
      //     chrome.tabs.getAllInWindow(window.id, function(tabs) {
      //       tabs.forEach(function(tab) {
      //         chrome.tabs.sendMessage(tab.id, {
      //           action: 'selection',
      //           activate: true,
      //           mode: 'container'
      //         }, function() {

      //         });
      //       });
      //     });
      //   });
      // });
    },
    onMessageReceived: function (data) {
      console.log(JSON.stringify(data));
    },
    onSelectionReceived: function(request) {
      if (request.action === 'add') {
        var container = {
          cid :       this.containers.length,
          pattern :   request.container,
          enclosing : request.enclosing
        };
        this.containers.push(container);
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
