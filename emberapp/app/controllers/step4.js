import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['step2'],
  containers: Ember.computed.alias('controllers.step2.containers')

});
