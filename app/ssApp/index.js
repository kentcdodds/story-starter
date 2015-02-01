let _ = require('lodash');
let stateUtils = require('stateUtils');
let utils = require('utils');
// do this before requiring the state modules because they use stateUtils which registers it with the common module.
let ssCommonModuleName = require('ngCommon').name;

let rootStates = require('../states');
let allStates = stateUtils.getStates(rootStates);
let allStateModules = utils.flatten(rootStates, 'data/children');

// have each state module configure its own state
_.each(allStates, function(state) {
  var stateModule = angular.module(state.data.module);
  stateModule.config($stateProvider => $stateProvider.state(state));
});

let deps = _.union([
  ssCommonModuleName
], _.pluck(allStateModules, 'name'));

let ngModule = require('registerModule')(__filename, deps);
module.exports.name = ngModule.name;

ngModule.config(config);

function config($urlRouterProvider, $httpProvider, $compileProvider, $stateProvider, onDev) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
  $httpProvider.useApplyAsync();

  $compileProvider.debugInfoEnabled(onDev);

  $urlRouterProvider.otherwise(function() {
    stateUtils.eventNavigate('noRouteMatch');
  });
}
