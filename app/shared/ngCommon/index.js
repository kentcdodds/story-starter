var _ = require('lodash');

var deps = [];

// require things that don't export the module or its name :-(
// the official angular ones will in the future!
require('angular-animate/angular-animate') && deps.push('ngAnimate');
require('angular-aria/angular-aria') && deps.push('ngAria');
require('angular-messages/angular-messages') && deps.push('ngMessages');
require('angular-sanitize/angular-sanitize') && deps.push('ngSanitize');

require('angular-bootstrap') && deps.push('ui.bootstrap');

// require all the things that do export the name (yay!)
deps = _.union(deps, [
  require('angular-ui-router'),
  require('angular-formly')
]);

let ngModule = require('registerModule')(__filename, deps);
module.exports.name = ngModule.name;



// all peeps who register under this thing!
require('./services')(ngModule);
require('./directives')(ngModule);
require('./constants')(ngModule);
