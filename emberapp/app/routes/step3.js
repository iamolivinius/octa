import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    onBack: function() {
      this.transitionTo('step2');
    },
    onNext: function() {
      this.transitionTo('step4');
    },
    didTransition: function() {
      this.send('setActiveStep', 3);
    }
  }
});
