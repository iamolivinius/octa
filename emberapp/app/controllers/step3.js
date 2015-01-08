import Ember from 'ember';

export default Ember.Controller.extend({

  needs: 'step2',
  containers: Ember.computed.alias('controllers.step2.containers'),

  init: function() {
    chrome.runtime.onMessage.addListener(function(request) {
      if (request.type === "trigger") {
        this.send('onTriggerReceived', request);
      }
      else if (request.type === "field") {
        this.send('onFieldReceived', request);
      }
    }.bind(this));
    this.send('onTriggerReceived', {cid: 0, trigger: '<div></div>', action: 'add'});
    this.send('onFieldReceived', {cid: 0, field: '<div>1</div>', action: 'add'});
    this.send('onFieldReceived', {cid: 0, field: '<div>2</div>', action: 'add'});
  },

  callSelector: function(mode, container) {
    //Run the Contentscript // switch to latest tab?
    chrome.windows.getAll(null, function(windows) {
      windows.forEach(function(window) {
        chrome.tabs.getAllInWindow(window.id, function(tabs) {
          tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'selection',
              activate: true,
              mode: mode,
              cid: container
            });
          });
        });
      });
    });
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
        var cs = this.get('containers');
        Ember.set(cs[request.cid], 'trigger', request.trigger);
        this.set('containers', cs);
      }
    },
    onFieldReceived: function(request) {
      console.log(request);
      if (request.action === 'add') {

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
