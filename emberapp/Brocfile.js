/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('bower_components/semantic-ui/dist/semantic.css');
app.import('bower_components/semantic-ui/dist/semantic.js');

var semanticFontFiles = pickFiles(app.bowerDirectory + '/semantic-ui/dist/themes', {
  srcDir: '/',
  files: ['**/*.ttf', '**/*.woff'],
  destDir: '/assets/themes'
});

module.exports = app.toTree(semanticFontFiles);

