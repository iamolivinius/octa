import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    onBack: function() {
      this.transitionTo('step1');
    },
    onNext: function() {
      this.transitionTo('step3');
    },
    didTransition: function() {
      this.send('setActiveStep', 2);
    }
  }
});
