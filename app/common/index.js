'use strict';

var angular = require('angular');

require('./lodash-mixins');
require('angular-aria/angular-aria');
require('angular-animate/angular-animate');

module.exports = angular.module('ssApp.common', [
  'ngMaterial', // not on npm yet :-(
  'ngAria',
  'ngAnimate',
  require('angular-ui-router')
]);
