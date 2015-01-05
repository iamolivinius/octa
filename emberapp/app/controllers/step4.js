import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['step2'],
  containers: Ember.computed.alias('controllers.step2.containers'),

  init: function() {
  },

  actions: {}

});

/*//Taken from inputs.js
$(document).on('input propertychange', '#process textarea', function () {
  // Get container name
  var container = $(this).attr('data-container');

  // Set processing function
  if (observer.containers[container] === undefined) {
    observer.containers[container] = {};
  }
  observer.containers[container].process = $(this).val();
});*/