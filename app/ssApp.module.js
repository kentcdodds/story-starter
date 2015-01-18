'use strict';

var angular = require('angular');
var _ = require('lodash');

var stateModules = [
  require('./states/root/login')
];

module.exports = angular.module('ssApp', _.union([
  require('./common').name
], _.pluck(stateModules, 'name')), config);


function config($stateProvider, $urlRouterProvider) {
  _.each(stateModules, function(ssAppModule) {
    _.each(ssAppModule.states, function(state) {
      $stateProvider.state(state.name, state);
    });
  });
  $urlRouterProvider.otherwise('/');
}
