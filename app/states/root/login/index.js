'use strict';
var angular = require('angular');


module.exports = angular.module('ssApp.login', []);


module.exports.states = [
  {
    url: '/',
    name: 'login',
    template: require('./index.html'),
    controller: function LoginCtrl() {
      var vm = this;
      vm.greeting = 'Hello!';
    },
    controllerAs: 'vm',
    data: {
      styles: require('./index.styl')
    }
  }
];

// module components
require('./directives');
