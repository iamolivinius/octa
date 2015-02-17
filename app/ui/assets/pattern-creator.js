define("pattern-creator/adapters/application", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.LSAdapter.extend({
      namespace: "observer-creator"
    });
  });
define("pattern-creator/app", 
  ["ember","ember/resolver","ember/load-initializers","pattern-creator/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("pattern-creator/components/ui-accordion", 
  ["semantic-ui-ember/components/ui-accordion","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Accordion = __dependency1__["default"];
    __exports__["default"] = Accordion;
  });
define("pattern-creator/components/ui-checkbox", 
  ["semantic-ui-ember/components/ui-checkbox","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Checkbox = __dependency1__["default"];
    __exports__["default"] = Checkbox;
  });
define("pattern-creator/components/ui-dropdown", 
  ["semantic-ui-ember/components/ui-dropdown","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Dropdown = __dependency1__["default"];
    __exports__["default"] = Dropdown;
  });
define("pattern-creator/components/ui-popup", 
  ["semantic-ui-ember/components/ui-popup","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Popup = __dependency1__["default"];
    __exports__["default"] = Popup;
  });
define("pattern-creator/components/ui-progress", 
  ["semantic-ui-ember/components/ui-progress","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Progress = __dependency1__["default"];
    __exports__["default"] = Progress;
  });
define("pattern-creator/components/ui-radio", 
  ["semantic-ui-ember/components/ui-radio","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Radio = __dependency1__["default"];
    __exports__["default"] = Radio;
  });
define("pattern-creator/components/ui-rating", 
  ["semantic-ui-ember/components/ui-rating","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Rating = __dependency1__["default"];
    __exports__["default"] = Rating;
  });
define("pattern-creator/controllers/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      activeStep: 1,
      port: {},
      tabId: null,
      contentTab: null,

      init: function () {
        chrome.tabs.getCurrent((function (tab) {
          this.set("tabId", tab.id);
          chrome.tabs.query({ currentWindow: true, index: tab.index - 1 }, (function (tabs) {
            if (tabs.length === 1) {
              this.set("contentTab", tabs[0].id);
              var connection = chrome.tabs.connect(tabs[0].id, { name: "octa-handshake" });
              this.set("port", connection);
            }
          }).bind(this));
        }).bind(this));
      },

      isStep1: (function () {
        return this.get("activeStep") === 1;
      }).property("activeStep"),

      isStep2: (function () {
        return this.get("activeStep") === 2;
      }).property("activeStep"),

      isStep3: (function () {
        return this.get("activeStep") === 3;
      }).property("activeStep"),

      isStep4: (function () {
        return this.get("activeStep") === 4;
      }).property("activeStep"),

      isStep5: (function () {
        return this.get("activeStep") === 5;
      }).property("activeStep") });
  });
define("pattern-creator/controllers/step1", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      selectedNetwork: "facebook",
      networks: ["facebook", "google"]
    });
  });
define("pattern-creator/controllers/step2", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: "application",
      port: Ember.computed.alias("controllers.application.port"),
      tabId: Ember.computed.alias("controllers.application.tabId"),
      contentTab: Ember.computed.alias("controllers.application.contentTab"),
      containers: [],

      init: function () {
        this.get("port").onMessage.addListener((function (request) {
          if (request.type === "container") {
            this.send("onSelectionReceived", request);
          }
        }).bind(this));
      },

      actions: {
        onSelectContainer: function () {
          console.log("Select Container Action starts!");
          //Run the Contentscript // switch to latest tab?
          this.get("port").postMessage({
            action: "selection",
            activate: true,
            mode: "container"
          });
          chrome.tabs.update(this.get("contentTab"), { active: true });
        },
        onRemoveContainer: function (container) {
          this.containers.removeObject(container);
        },
        onSelectionReceived: function (request) {
          if (request.action === "add") {
            chrome.tabs.update(this.get("tabId"), { active: true });
            var container = {
              cid: this.containers.length,
              pattern: request.container,
              enclosing: request.enclosing
            };
            this.containers.pushObject(container);
          }
        }
      }
    });
  });
define("pattern-creator/controllers/step3", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({

      needs: ["application", "step2"],
      port: Ember.computed.alias("controllers.application.port"),
      tabId: Ember.computed.alias("controllers.application.tabId"),
      contentTab: Ember.computed.alias("controllers.application.contentTab"),
      containers: Ember.computed.alias("controllers.step2.containers"),

      init: function () {
        this.get("port").onMessage.addListener((function (request) {
          if (request.type === "trigger") {
            this.send("onTriggerReceived", request);
          } else if (request.type === "field") {
            this.send("onFieldReceived", request);
          }
        }).bind(this));
      },

      callSelector: function (mode, container) {
        //Run the Contentscript // switch to latest tab?
        this.get("port").postMessage({
          action: "selection",
          activate: true,
          mode: mode,
          cid: container
        });
        chrome.tabs.update(this.get("contentTab"), { active: true });
      },

      actions: {
        onSelectTrigger: function (containerId) {
          console.log("Select Trigger Action starts!");
          this.callSelector("trigger", containerId);
        },
        onSelectField: function (containerId) {
          console.log("Select Field Action starts!");
          this.callSelector("field", containerId);
        },
        onRemoveField: function (field) {
          var cs = this.get("containers");
          cs[field.cid].fields.removeObject(field);
          this.set("containers", cs);
        },
        onTriggerReceived: function (request) {
          console.log(request);
          if (request.action === "add" && request.trigger !== undefined) {
            chrome.tabs.update(this.get("tabId"), { active: true });
            var cs = this.get("containers");
            Ember.set(cs[request.cid], "trigger", request.trigger);
            this.set("containers", cs);
          }
        },
        onFieldReceived: function (request) {
          console.log(request);
          if (request.action === "add") {
            chrome.tabs.update(this.get("tabId"), { active: true });

            var cs = this.get("containers");

            if (cs[request.cid].fields === undefined) {
              Ember.set(cs[request.cid], "fields", []);
            }
            cs[request.cid].fields.pushObject({
              field: request.field,
              cid: request.cid
            });
            this.set("containers", cs);
          }
        }
      }
    });
  });
define("pattern-creator/controllers/step4", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({

      needs: ["step2"],
      containers: Ember.computed.alias("controllers.step2.containers")

    });
  });
define("pattern-creator/controllers/step5", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({

      needs: ["step2", "step1"],
      containers: Ember.computed.alias("controllers.step2.containers"),

      observerString: (function () {
        var observer = {
          name: this.get("controllers.step1.observerName"),
          version: this.get("controllers.step1.observerVersion"),
          author: this.get("controllers.step1.observerAuthor"),
          network: this.get("controllers.step1.observerNetwork"),
          containers: this.get("containers")
        };
        return JSON.stringify(observer);
      }).property("controllers.step1.observerName", "controllers.step1.observerVersion", "controllers.step1.observerAuthor", "controllers.step1.observerNetwork", "containers.@each.trigger", "containers.@each.process"),

      actions: {
        onExport: function () {
          var a = document.createElement("a");
          a.href = "data:attachment/json," + this.get("observerString");
          a.target = "_blank";
          a.download = this.get("controllers.step1.observerName") + this.get("controllers.step1.observerVersion") + ".json";

          document.body.appendChild(a);
          a.click();
        }
      }
    });
  });
define("pattern-creator/initializers/export-application-global", 
  ["ember","pattern-creator/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: "export-application-global",

      initialize: initialize
    };
  });
define("pattern-creator/models/pattern", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      name: DS.attr("string"),
      version: DS.attr("number"),
      author: DS.attr("string"),
      network: DS.attr("string") });
  });
define("pattern-creator/router", 
  ["ember","pattern-creator/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType
    });

    Router.map(function () {
      this.route("step1");
      this.route("step2");
      this.route("step3");
      this.route("step4");
      this.route("step5");
    });



    __exports__["default"] = Router;
  });
define("pattern-creator/routes/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      actions: {
        setActiveStep: function (step) {
          this.controller.set("activeStep", step);
        }
      }
    });
  });
define("pattern-creator/routes/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("step1");
      }
    });
  });
define("pattern-creator/routes/step1", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      actions: {
        onNext: function () {
          this.transitionTo("step2");
        },
        didTransition: function () {
          this.send("setActiveStep", 1);
        }
      }
    });
  });
define("pattern-creator/routes/step2", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      actions: {
        onBack: function () {
          this.transitionTo("step1");
        },
        onNext: function () {
          this.transitionTo("step3");
        },
        didTransition: function () {
          this.send("setActiveStep", 2);
        }
      }
    });
  });
define("pattern-creator/routes/step3", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      actions: {
        onBack: function () {
          this.transitionTo("step2");
        },
        onNext: function () {
          this.transitionTo("step4");
        },
        didTransition: function () {
          this.send("setActiveStep", 3);
        }
      }
    });
  });
define("pattern-creator/routes/step4", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      actions: {
        onBack: function () {
          this.transitionTo("step3");
        },
        onNext: function () {
          this.transitionTo("step5");
        },
        didTransition: function () {
          this.send("setActiveStep", 4);
        }
      }
    });
  });
define("pattern-creator/routes/step5", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      actions: {
        onBack: function () {
          this.transitionTo("step4");
        },
        didTransition: function () {
          this.send("setActiveStep", 5);
        }
      }
    });
  });
define("pattern-creator/serializers/application", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.LSSerializer.extend();
  });
define("pattern-creator/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"ui page grid\">\n  <div class=\"ui sixteen wide column\">\n    <div class=\"ui five small steps\">\n      <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isStep1:active :step")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n        <i class=\"info circle icon\"></i>\n        <div class=\"content\">\n          <div class=\"title\">Information</div>\n        </div>\n      </div>\n      <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isStep2:active :step")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n        <i class=\"archive icon\"></i>\n        <div class=\"content\">\n          <div class=\"title\">Containers</div>\n        </div>\n      </div>\n      <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isStep3:active :step")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n        <i class=\"browser icon\"></i>\n        <div class=\"content\">\n          <div class=\"title\">Fields</div>\n        </div>\n      </div>\n      <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isStep4:active :step")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n        <i class=\"code icon\"></i>\n        <div class=\"content\">\n          <div class=\"title\">Postprocessing</div>\n        </div>\n      </div>\n      <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isStep5:active :step")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n        <i class=\"download icon\"></i>\n        <div class=\"content\">\n          <div class=\"title\">Finalize</div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"ui sixteen wide column\">\n    <div class=\"ui segment\">\n      ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("pattern-creator/templates/components/ui-dropdown", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("icon :icon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n  <i class=\"dropdown icon\"></i>\n");
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    ");
      stack1 = helpers.each.call(depth0, "group", "in", "view.groupedContent", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.groupView", {hash:{
        'content': ("content"),
        'label': ("label")
      },hashTypes:{'content': "ID",'label': "ID"},hashContexts:{'content': depth0,'label': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    ");
      return buffer;
      }

    function program8(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    ");
      stack1 = helpers.each.call(depth0, "item", "in", "view.content", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program9(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.optionView", {hash:{
        'content': ("item"),
        'valuePath': ("view.optionValuePath")
      },hashTypes:{'content': "ID",'valuePath': "ID"},hashContexts:{'content': depth0,'valuePath': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n    ");
      return buffer;
      }

    function program11(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      data.buffer.push("<div class=\"text\">");
      stack1 = helpers._triageMustache.call(depth0, "view.prompt", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n");
      stack1 = helpers['if'].call(depth0, "icon", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<div class=\"menu\">\n  ");
      stack1 = helpers['if'].call(depth0, "view.optionGroupPath", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(8, program8, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      stack1 = helpers['if'].call(depth0, "view.template", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("pattern-creator/templates/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("pattern-creator/templates/step1", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<h2 class=\"ui dividing header\">\n  <i class=\"info circle icon\"></i>\n  <div class=\"content\">\n    General Information\n    <div class=\"sub header\">\n      Configure the observer's general information.\n    </div>\n  </div>\n</h2>\n\n<div class=\"ui form\">\n  <div class=\"field\">\n    <label>Name</label>\n    <div class=\"left labeled input\">\n      ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("text"),
        'value': ("observerName")
      },hashTypes:{'type': "STRING",'value': "ID"},hashContexts:{'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>Version</label>\n    <div class=\"left labeled input\">\n      ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("number"),
        'min': (0),
        'value': ("observerVersion")
      },hashTypes:{'type': "STRING",'min': "INTEGER",'value': "ID"},hashContexts:{'type': depth0,'min': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>Author</label>\n    <div class=\"left labeled input\">\n      ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("text"),
        'value': ("observerAuthor")
      },hashTypes:{'type': "STRING",'value': "ID"},hashContexts:{'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>Network</label>\n    ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
        'content': ("networks"),
        'class': (""),
        'value': ("selectedNetwork")
      },hashTypes:{'content': "ID",'class': "STRING",'value': "ID"},hashContexts:{'content': depth0,'class': depth0,'value': depth0},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push("\n  </div>\n\n  <div class=\"ui right labeled icon submit primary button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"right arrow icon\"></i>\n    Next\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("pattern-creator/templates/step2", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    <tr>\n      <td>\n        <div class=\"ui input\">\n          ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("text"),
        'value': ("con.name")
      },hashTypes:{'type': "STRING",'value': "ID"},hashContexts:{'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n        </div>\n      </td>\n      <td>\n        <div class=\"ui form\">\n          <div class=\"field\">\n            ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("con.enclosing")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n          </div>\n        </div>\n      </td>\n      <td>\n        <div class=\"ui form\">\n          <div class=\"field\">\n            ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("con.pattern")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n          </div>\n        </div>\n      </td>\n      <td>\n        <div class=\"ui red icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onRemoveContainer", "con", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push("><i class=\"trash icon\"></i></div></td>\n    </tr>\n    ");
      return buffer;
      }

      data.buffer.push("<h2 class=\"ui dividing header\">\n  <i class=\"archive icon\"></i>\n  <div class=\"content\">\n    Containers\n    <div class=\"sub header\">\n      Select the observer's containers.\n    </div>\n  </div>\n</h2>\n\n<table class=\"ui table\">\n  <thead>\n    <tr>\n      <th width=\"20%\">Name</th>\n      <th width=\"20%\">Enclosing Identifier</th>\n      <th>Container</th>\n      <th>Remove</th>\n    </tr>\n  </thead>\n  <tbody>\n    ");
      stack1 = helpers.each.call(depth0, "con", "in", "containers", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n  <tfoot>\n    <tr>\n      <th colspan=\"4\">\n        <div class=\"ui blue labeled icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onSelectContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push("><i class=\"add icon\"></i> Select Container</div>\n      </th>\n    </tr>\n  </tfoot>\n</table>\n\n<div class=\"ui left labeled icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onBack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <i class=\"left arrow icon\"></i>\n  Back\n</div>\n\n<div class=\"ui right labeled icon primary button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <i class=\"right arrow icon\"></i>\n  Next\n</div>\n");
      return buffer;
      
    });
  });
define("pattern-creator/templates/step3", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n<div class=\"ui segment\">\n  <h3 class=\"ui dividing header\">\n    Container: <strong>");
      stack1 = helpers._triageMustache.call(depth0, "con.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</strong>\n  </h3>\n\n  <div class=\"ui vertical segment\">\n    <div class=\"ui red ribbon label\">Trigger</div>\n    <p>\n      ");
      stack1 = helpers['if'].call(depth0, "con.trigger", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </p>\n  </div>\n\n  <div class=\"ui vertical segment\">\n    <div class=\"ui teal ribbon label\">Fields</div>\n    <table class=\"ui table segment fields-table\">\n      <thead>\n        <tr>\n          <th>Name</th>\n          <th>Pattern</th>\n          <th>Remove</th>\n        </tr>\n      </thead>\n      <tbody>\n\n      ");
      stack1 = helpers.each.call(depth0, "field", "in", "con.fields", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n      </tbody>\n      <tfoot>\n        <tr>\n          <th colspan=\"3\">\n            <div class=\"ui blue labeled icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onSelectField", "con.cid", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(">\n              <i class=\"add icon\"></i> Add Field\n            </div>\n            <div class=\"ui labeled icon button\">\n              <i class=\"lab icon\"></i> Test Container\n            </div>\n          </th>\n        </tr>\n      </tfoot>\n    </table>\n  </div>\n\n</div>\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      <label>Triggerpattern: ");
      stack1 = helpers._triageMustache.call(depth0, "con.trigger", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</label>\n      <div class=\"ui red tiny button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onSelectTrigger", "con.cid", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(" >\n        Remove and Select New Trigger\n      </div>\n      ");
      return buffer;
      }

    function program4(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      <div class=\"ui tiny button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onSelectTrigger", "con.cid", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(" >\n        Select Trigger\n      </div>\n      ");
      return buffer;
      }

    function program6(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n        <tr>\n          <td>\n            <div class=\"ui input\">\n              ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("text"),
        'value': ("field.name")
      },hashTypes:{'type': "STRING",'value': "ID"},hashContexts:{'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n            </div>\n          </td>\n          <td>\n            <div class=\"ui form\">\n              <div class=\"field\">\n                ");
      stack1 = (helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("field.field")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n              </div>\n            </div>\n          </td>\n          <td>\n            <div class=\"ui red icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onRemoveField", "field", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
      data.buffer.push(">\n              <i class=\"trash icon\"></i>\n            </div>\n          </td>\n        </tr>\n      ");
      return buffer;
      }

    function program8(depth0,data) {
      
      
      data.buffer.push("\n<div class=\"ui warning message\">\n  <div class=\"header\">\n    No Containers Available\n  </div>\n  <p>Please add some containers before creating fields.</p>\n</div>\n");
      }

      data.buffer.push("<h2 class=\"ui dividing header\">\n  <i class=\"browser icon\"></i>\n  <div class=\"content\">\n    Extractable Fields\n    <div class=\"sub header\">\n      Set each container's extractable fields.\n    </div>\n  </div>\n</h2>\n\n");
      stack1 = helpers.each.call(depth0, "con", "in", "containers", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(8, program8, data),fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<div class=\"ui left labeled icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onBack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <i class=\"left arrow icon\"></i>\n  Back\n</div>\n\n<div class=\"ui right labeled icon submit primary button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <i class=\"right arrow icon\"></i>\n  Next\n</div>\n");
      return buffer;
      
    });
  });
define("pattern-creator/templates/step4", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n<div class=\"ui segment\">\n  <div class=\"row\">\n    <div class=\"column\">\n      <h3 class=\"ui header\">Container: <strong>");
      stack1 = helpers._triageMustache.call(depth0, "con.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</strong></h3>\n      <br>\n    </div>\n  </div>\n\n  <div class=\"ui form\">\n    <div class=\"field\">\n      <label>Process function</label>\n      ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("con.process")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n<div class=\"ui warning message\">\n  <div class=\"header\">\n    No Containers Available\n  </div>\n  <p>Please add some containers before creating processing functions.</p>\n</div>\n");
      }

      data.buffer.push("<h2 class=\"ui dividing header\">\n  <i class=\"code icon\"></i>\n  <div class=\"content\">\n    Postprocessing\n    <div class=\"sub header\">\n      Set each container's processing function.\n    </div>\n  </div>\n</h2>\n\n");
      stack1 = helpers.each.call(depth0, "con", "in", "containers", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<div class=\"ui left labeled icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onBack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <i class=\"left arrow icon\"></i>\n  Back\n</div>\n\n<div class=\"ui right labeled icon submit primary button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n  <i class=\"right arrow icon\"></i>\n  Next\n</div>\n");
      return buffer;
      
    });
  });
define("pattern-creator/templates/step5", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<h2 class=\"ui dividing header\">\n  <i class=\"download icon\"></i>\n  <div class=\"content\">\n    Finalize\n    <div class=\"sub header\">\n      Generate and manage the final observer file.\n    </div>\n  </div>\n</h2>\n\n<div class=\"ui form\">\n  <div class=\"field\">\n    <label>Observer File:</label>\n    <div class=\"left labeled input\">\n      ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'value': ("observerString")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n    </div>\n  </div>\n\n  <div class=\"ui left labeled icon button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onBack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"left arrow icon\"></i>\n    Back\n  </div>\n\n  <div class=\"ui right labeled icon submit positive button\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "onExport", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"download icon\"></i>\n    Export\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("pattern-creator/tests/adapters/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/application.js should pass jshint', function() { 
      ok(true, 'adapters/application.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/controllers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/application.js should pass jshint', function() { 
      ok(true, 'controllers/application.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/controllers/step1.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/step1.js should pass jshint', function() { 
      ok(true, 'controllers/step1.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/controllers/step2.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/step2.js should pass jshint', function() { 
      ok(true, 'controllers/step2.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/controllers/step3.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/step3.js should pass jshint', function() { 
      ok(true, 'controllers/step3.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/controllers/step4.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/step4.js should pass jshint', function() { 
      ok(true, 'controllers/step4.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/controllers/step5.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/step5.js should pass jshint', function() { 
      ok(true, 'controllers/step5.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/helpers/resolver", 
  ["ember/resolver","pattern-creator/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("pattern-creator/tests/helpers/start-app", 
  ["ember","pattern-creator/app","pattern-creator/router","pattern-creator/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function () {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("pattern-creator/tests/models/pattern.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/pattern.js should pass jshint', function() { 
      ok(true, 'models/pattern.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/helpers');
    test('pattern-creator/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/helpers');
    test('pattern-creator/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests');
    test('pattern-creator/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/test-helper.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/adapters/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/adapters');
    test('pattern-creator/tests/unit/adapters/application-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/adapters/application-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/controllers/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/controllers');
    test('pattern-creator/tests/unit/controllers/application-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/controllers/application-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/controllers/step1-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/controllers');
    test('pattern-creator/tests/unit/controllers/step1-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/controllers/step1-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/controllers/step2-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/controllers');
    test('pattern-creator/tests/unit/controllers/step2-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/controllers/step2-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/controllers/step5-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/controllers');
    test('pattern-creator/tests/unit/controllers/step5-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/controllers/step5-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/models/pattern-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/models');
    test('pattern-creator/tests/unit/models/pattern-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/models/pattern-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/routes/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/routes');
    test('pattern-creator/tests/unit/routes/application-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/routes/application-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/routes/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/routes');
    test('pattern-creator/tests/unit/routes/index-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/routes/index-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/routes/step1-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/routes');
    test('pattern-creator/tests/unit/routes/step1-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/routes/step1-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/routes/step2-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/routes');
    test('pattern-creator/tests/unit/routes/step2-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/routes/step2-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/routes/step3-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/routes');
    test('pattern-creator/tests/unit/routes/step3-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/routes/step3-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/routes/step4-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/routes');
    test('pattern-creator/tests/unit/routes/step4-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/routes/step4-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/routes/step5-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/routes');
    test('pattern-creator/tests/unit/routes/step5-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/routes/step5-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/serializers/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/serializers');
    test('pattern-creator/tests/unit/serializers/application-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/serializers/application-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/pattern-creator/tests/unit/views/step1-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - pattern-creator/tests/unit/views');
    test('pattern-creator/tests/unit/views/step1-test.js should pass jshint', function() { 
      ok(true, 'pattern-creator/tests/unit/views/step1-test.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/routes/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/application.js should pass jshint', function() { 
      ok(true, 'routes/application.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/routes/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/index.js should pass jshint', function() { 
      ok(true, 'routes/index.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/routes/step1.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/step1.js should pass jshint', function() { 
      ok(true, 'routes/step1.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/routes/step2.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/step2.js should pass jshint', function() { 
      ok(true, 'routes/step2.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/routes/step3.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/step3.js should pass jshint', function() { 
      ok(true, 'routes/step3.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/routes/step4.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/step4.js should pass jshint', function() { 
      ok(true, 'routes/step4.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/routes/step5.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/step5.js should pass jshint', function() { 
      ok(true, 'routes/step5.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/serializers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - serializers');
    test('serializers/application.js should pass jshint', function() { 
      ok(true, 'serializers/application.js should pass jshint.'); 
    });
  });
define("pattern-creator/tests/test-helper", 
  ["pattern-creator/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

    QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
    var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
    document.getElementById("ember-testing-container").style.visibility = containerVisibility;
  });
define("pattern-creator/tests/unit/adapters/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("adapter:application", "ApplicationAdapter", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var adapter = this.subject();
      ok(adapter);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("pattern-creator/tests/unit/controllers/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:application", "ApplicationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/controllers/step1-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:step1", "Step1Controller", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/controllers/step2-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:step2", "Step2Controller", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/controllers/step5-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:step5", "Step5Controller", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/models/pattern-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("pattern", "Pattern", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("pattern-creator/tests/unit/routes/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:application", "ApplicationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/routes/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:index", "IndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/routes/step1-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:step1", "Step1Route", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/routes/step2-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:step2", "Step2Route", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/routes/step3-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:step3", "Step3Route", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/routes/step4-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:step4", "Step4Route", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/routes/step5-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:step5", "Step5Route", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("pattern-creator/tests/unit/serializers/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("serializer:application", "ApplicationSerializer", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var serializer = this.subject();
      ok(serializer);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("pattern-creator/tests/unit/views/step1-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:step1", "Step1View");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("pattern-creator/tests/views/step1.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/step1.js should pass jshint', function() { 
      ok(true, 'views/step1.js should pass jshint.'); 
    });
  });
define("pattern-creator/views/step1", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({});
    // initDropdown: function() {
    //   $('.ui.dropdown')
    //     .dropdown();
    // }.on('didInsertElement')
  });
define("pattern-creator/views/ui-modal", 
  ["semantic-ui-ember/views/ui-modal","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Modal = __dependency1__["default"];
    __exports__["default"] = Modal;
  });
/* jshint ignore:start */

define('pattern-creator/config/environment', ['ember'], function(Ember) {
  var prefix = 'pattern-creator';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("pattern-creator/tests/test-helper");
} else {
  require("pattern-creator/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true});
}

/* jshint ignore:end */
//# sourceMappingURL=pattern-creator.map