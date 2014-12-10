import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    setActiveStep: function(step) {
      this.controller.set('activeStep', step);
    }
  }
});
