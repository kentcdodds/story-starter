let ngModule = require('registerModule')(__filename, require('ngCommon'));
module.exports.name = ngModule.name;
require('./services')(ngModule);
