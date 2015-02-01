// globals... as few of these as possible please
let angular = require('angular');
if (!window.angular && !angular.version) {
  throw new Error('Uh oh, where did angular go?');
} else if (angular.version) {
  window.angular = angular;
}

if (ON_DEV) {
  require('./dev.excluded');
  try {
    require('./custom.ignored');
  } catch (e) {
    // looks like you just didn't have a custom.ignored. No biggy
  }
}

require('./other');
