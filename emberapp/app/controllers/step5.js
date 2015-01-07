import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['step2', 'step1'],

  observerString: function () {
    var observer = {
      name:       this.get('controllers.step1.observerName'),
      version:    this.get('controllers.step1.observerVersion'),
      author:     this.get('controllers.step1.observerAuthor'),
      network:    this.get('controllers.step1.observerNetwork'),
      containers: this.get('controllers.step2.containers')
    };
    return JSON.stringify(observer);
  }.property("controllers.step1.observerName", "controllers.step1.observerVersion", "controllers.step1.observerAuthor", "controllers.step1.observerNetwork", "controllers.step2.containers"),

  actions: {
    onExport: function() {
      var a      = document.createElement('a');
      a.href     = 'data:attachment/json,' + this.get('observerString');
      a.target   = '_blank';
      a.download = this.get('controllers.step1.observerName') + this.get('controllers.step1.observerVersion') + '.json';

      document.body.appendChild(a);
      a.click();
    }
  }
});
