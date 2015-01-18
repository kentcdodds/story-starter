'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ssApp.login').directive('ssLoginBackground', ssLoginBackground);

function ssLoginBackground() {
  return {
    restrict: 'E',
    link: function(scope) {
      var body = document.body;
      var background = _.getDirectory(__filename) + '/bg' + Math.floor(Math.random() * 19) + '.jpg';
      var originalBackground = body.style.background;
      var originalBackgroundSize = body.style['background-size'];
      body.style.background = 'url("' + background + '") no-repeat center center fixed';
      body.style['background-size'] = 'cover';

      scope.$on('$destroy', function() {
        body.style.background = originalBackground;
        body.style['background-size'] = originalBackgroundSize;
      });
    }
  };
}
