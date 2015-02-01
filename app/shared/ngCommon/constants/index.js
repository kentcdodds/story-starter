module.exports = ngModule => {
  require('./onDev')(ngModule);
  require('./onTest')(ngModule);
  require('./onProd')(ngModule);
  require('./isIE')(ngModule);

  ngModule.constant('_', require('lodash'));
  ngModule.constant('Echo', require('echo-logger'));
};
