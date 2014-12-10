import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    onBack: function() {
      this.transitionTo('step3');
    },
    onNext: function() {
      this.transitionTo('step5');
    },
    didTransition: function() {
      this.send('setActiveStep', 4);
    }
  }
});
