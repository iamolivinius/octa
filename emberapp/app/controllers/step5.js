import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['step2', 'step1'],

  observerString: "",

  init: function () {
  	//move to route or action onDisplay
    var observer = {
    	name:  		this.get('controllers.step1.observerName'),
    	version:  	this.get('controllers.step1.observerVersion'),
    	author:  	this.get('controllers.step1.observerAuthor'),
    	network:  	this.get('controllers.step1.observerNetwork'),
    	containers: this.get('controllers.step2.containers')
    };
    this.observerString = JSON.stringify(observer);
  },

  actions: {
    onExport: function() {
		var a         = document.createElement('a');
		a.href        = 'data:attachment/json,' + this.observerString;
		a.target      = '_blank';
		a.download    = this.get('controllers.step1.observerName') + this.get('controllers.step1.observerVersion') + '.json';

		document.body.appendChild(a);
		a.click();
    }
  }
});
