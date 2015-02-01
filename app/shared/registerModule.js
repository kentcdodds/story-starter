var _ = require('lodash');
var count = 1; // prevents modules from ever having the same name
var modulePrefix = 'ss';
module.exports = (filename, common) => {
  let deps;
  if (_.isArray(common)) {
    deps = common;
  } else if (common.name) {
    deps = [common.name];
  } else {
    deps = [];
  }
  let moduleSuffix;
  if (ON_DEV) {
    moduleSuffix = `${filename}Module`;
  } else {
    moduleSuffix = `${count++}Module${_.random(999999)}`;
  }
  return angular.module(`${modulePrefix}${moduleSuffix}`, deps);
};

module.exports.modulePrefix = modulePrefix;
