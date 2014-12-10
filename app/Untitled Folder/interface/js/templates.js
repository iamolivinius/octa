this["Templates"] = this["Templates"] || {};

this["Templates"]["testing-overlay"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <tr>\n        <td>"
    + escapeExpression(lambda((data && data.key), depth0))
    + "</td>\n        <td>"
    + escapeExpression(lambda(depth0, depth0))
    + "</td>\n      </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"testing-overlay\">\n  <table>\n    <thead>\n      <tr>\n        <th>Field</th>\n        <th>Content</th>\n      </tr>\n    </thead>\n    <tbody>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </tbody>\n  </table>\n</div>";
},"useData":true});



this["Templates"]["containers-segment"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "    <tr>\n      <td class=\"tbl-container-name\">"
    + escapeExpression(lambda((data && data.key), depth0))
    + "</td>\n      <td style=\"font-family: monospace;\">"
    + escapeExpression(lambda((depth0 != null ? depth0.enclosing : depth0), depth0))
    + "</td>\n      <td style=\"font-family: monospace;\">"
    + escapeExpression(lambda((depth0 != null ? depth0.pattern : depth0), depth0))
    + "</td>\n    </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"ui header\">\n  Containers\n  <div class=\"sub header\">\n    Select the observer's containers.\n  </div>\n</div>\n\n<table class=\"ui table segment\" id=\"container-table\">\n  <thead>\n    <tr>\n      <th width=\"20%\">Name</th>\n      <th width=\"20%\">Enclosing Identifier</th>\n      <th>Container</th>\n    </tr>\n  </thead>\n  <tbody>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.containers : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </tbody>\n  <tfoot>\n    <tr>\n      <th colspan=\"3\">\n        <div class=\"ui blue labeled icon button\" id=\"btn-select-container\"><i class=\"add icon\"></i> Select Container</div>\n        <div class=\"ui red labeled disabled icon button\" id=\"btn-remove-container\"><i class=\"remove icon\"></i> Remove</div>\n      </th>\n    </tr>\n  </tfoot>\n</table>";
},"useData":true});



this["Templates"]["fields-segment"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<div class=\"ui segment\">\n  <div class=\"row\">\n    <div class=\"column\">\n      <h3 class=\"ui header\">\n        Container: <strong>"
    + escapeExpression(lambda((data && data.key), depth0))
    + "</strong>\n      </h3>\n      <br>\n    </div>\n  </div>\n  \n  <div class=\"row\">\n    <div class=\"column\">\n      <div class=\"ui red ribbon label\">Trigger</div>\n      <p>\n        <label id=\"ctn-"
    + escapeExpression(lambda((data && data.key), depth0))
    + "-trigger\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.trigger : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "        </label>\n        <div class=\"ui tiny button btn-trigger-select\" data-container=\""
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">\n          Select Trigger\n        </div>\n      </p>\n    </div>\n  </div>\n  \n  <div class=\"row\">\n    <div class=\"column\">\n      <div class=\"ui teal ribbon label\">Fields</div>\n      <table class=\"ui table segment fields-table ctn-"
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">\n        <thead>\n          <tr>\n            <th>Name</th>\n            <th>Pattern</th>\n          </tr>\n        </thead>\n        <tbody>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.fields : depth0), {"name":"each","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        </tbody>\n        <tfoot>\n          <tr>\n            <th colspan=\"2\">\n              <div class=\"ui blue labeled icon button btn-add-field\" data-container=\""
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">\n                <i class=\"add icon\"></i> Add\n              </div>\n              <div class=\"ui red disabled labeled icon button btn-remove-field\" data-container=\""
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">\n                <i class=\"remove icon\"></i> Remove\n              </div>\n              <div class=\"ui labeled icon button btn-test-container\" data-container=\""
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">\n                <i class=\"unhide icon\"></i> Test Container\n              </div>\n            </th>\n          </tr>\n        </tfoot>\n      </table>\n    </div>\n  </div>\n</div>\n";
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "            "
    + escapeExpression(lambda((depth0 != null ? depth0.trigger : depth0), depth0))
    + "\n";
},"4":function(depth0,helpers,partials,data) {
  return "            Not set\n";
  },"6":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "          <tr><td class=\"field-name\" data-container=\""
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.fieldname || (depth0 != null ? depth0.fieldname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldname","hash":{},"data":data}) : helper)))
    + "</td><td>"
    + escapeExpression(((helper = (helper = helpers.field || (depth0 != null ? depth0.field : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field","hash":{},"data":data}) : helper)))
    + "</td></tr>\n";
},"8":function(depth0,helpers,partials,data) {
  return "<div class=\"ui warning message\">\n  <div class=\"header\">\n    No Containers Available\n  </div>\n  <p>Please add some containers before creating fields.</p>\n</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"ui header\">\n  Extractable Fields\n  <div class=\"sub header\">\n    Set each container's extractable fields.\n  </div>\n</div>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.containers : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.program(8, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});



this["Templates"]["finalize-segment"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"ui header\">\n  Finalize\n  <div class=\"sub header\">\n    Generate and manage the final observer file.\n  </div>\n</div>\n\n<div class=\"row\">\n  <div class=\"column\">\n    <div class=\"ui green icon button\" id=\"btn-finalize\">\n      <i class=\"save icon\"></i> Save observer\n    </div>\n  </div>\n</div>\n\n<br>\n\n<div class=\"row\">\n  <div class=\"column\">\n    <div class=\"ui form\">\n      <div class=\"field\">\n        <label>Observer File:</label>\n        <div class=\"left labeled input\">\n          <textarea id=\"observer-area\" style=\"font-family: monospace;\"></textarea>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
  },"useData":true});



this["Templates"]["general-segment"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"ui header\">\n  General Information\n  <div class=\"sub header\">\n    Configure the observer's general information.\n  </div>\n</div>\n\n<div class=\"ui form\">\n  <div class=\"field\">\n    <label>Name</label>\n    <div class=\"left labeled input\">\n      <input type=\"text\" name=\"name\" placeholder=\"Observer Name\">\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>Version</label>\n    <div class=\"left labeled input\">\n      <input type=\"text\" name=\"version\" placeholder=\"Version\">\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>Author</label>\n    <div class=\"left labeled input\">\n      <input type=\"text\" name=\"author\" placeholder=\"Author\">\n    </div>\n  </div>\n  <div class=\"field\">\n    <label>Network</label>\n    <div class=\"ui selection dropdown\">\n      <input type=\"hidden\" name=\"network\">\n      <div class=\"default text\">Network</div>\n      <i class=\"dropdown icon\"></i>\n      <div class=\"menu\">\n        <div class=\"item\" data-value=\"facebook\">Facebook</div>\n        <div class=\"item\" data-value=\"googleplus\">Google Plus</div>\n      </div>\n    </div>\n  </div>\n</div>";
  },"useData":true});



this["Templates"]["process-segment"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"ui segment\">\n  <div class=\"row\">\n    <div class=\"column\">\n      <h3 class=\"ui header\">Container: <strong>"
    + escapeExpression(lambda((data && data.key), depth0))
    + "</strong></h3>\n      <br>\n    </div>\n  </div>\n  \n  <div class=\"ui form\">\n    <div class=\"field\">\n      <label>Process function</label>\n      <textarea data-container=\""
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">"
    + escapeExpression(lambda((depth0 != null ? depth0.process : depth0), depth0))
    + "</textarea>\n    </div>\n  </div>\n</div>\n";
},"3":function(depth0,helpers,partials,data) {
  return "<div class=\"ui warning message\">\n  <div class=\"header\">\n    No Containers Available\n  </div>\n  <p>Please add some containers before creating processing functions.</p>\n</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"ui header\">\n  Postprocessing\n  <div class=\"sub header\">\n    Set each container's processing function.\n  </div>\n</div>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.containers : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});