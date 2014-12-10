import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    onNext: function() {
      this.transitionTo('step2');
    },
    didTransition: function() {
      this.send('setActiveStep', 1);
    }
  }
});
