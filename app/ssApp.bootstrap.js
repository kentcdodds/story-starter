'use strict';

var angular = require('angular');

var ssApp = require('./ssApp.module');

angular.element(document).ready(function() {
  angular.bootstrap(document, [ssApp.name]);
  console.log('Bootstrapped ' + ssApp.name);
  angular.element(document.getElementById('app-loading-message')).remove();
});
