import Ember from 'ember';

export default Ember.Controller.extend({

  needs: 'step2',
  containers: Ember.computed.alias('controllers.step2.containers'),

  init: function() {
    this.send('onTriggerReceived', {cid: 0, trigger: '<div></div>', action: 'add'});
    this.send('onFieldReceived', {cid: 0, field: '<div>1</div>', action: 'add'});
    this.send('onFieldReceived', {cid: 0, field: '<div>2</div>', action: 'add'});
  },

  actions: {    
    onTriggerReceived: function(request) {
      if (request.action === 'add') {
        var trigger = request.trigger;

        if (trigger === undefined) {
          return;
        }

        var cs = this.get('containers');
        cs[request.cid].trigger = trigger;
        this.set('containers', cs);
      }
    },
    onFieldReceived: function(request) {
      if (request.action === 'add') {

        var cs = this.get('containers');

        if (cs[request.cid].fields === undefined) {
          cs[request.cid].fields = [];
        }

        cs[request.cid].fields.push({
          field: request.field
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
