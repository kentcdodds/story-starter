let utils = require('utils');
let _ = require('lodash');
module.exports = (filename, dependencies, state) => {
  let deps;
  if (_.isArray(dependencies)) {
    deps = dependencies;
  } else if (dependencies.name) {
    deps = [dependencies.name];
  } else {
    deps = [];
  }
  deps.push(require('angular-ui-router'));
  let ngModule = require('registerModule')(filename.replace(/\./g, '-'), dependencies);
  var templateAttrs = ON_DEV ? ` data-state-url="${state.url}" data-state-name="${ngModule.name}"` : '';
  utils.reverseDeepMerge(state, {
    name: ngModule.name,
    controllerAs: 'vm',
    template: `<div ui-view${templateAttrs}></div>`
  });
  return {state, ngModule};
};
