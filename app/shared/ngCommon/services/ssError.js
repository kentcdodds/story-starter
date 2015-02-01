module.exports = ngModule => {
  ngModule.factory('ssError', SSErrorFactoryDefinition);

  function SSErrorFactoryDefinition(Echo, _) {
    var ssErrorLog = Echo.create('ssErrorLog', {defaultColor: 'red', rank: 0});
    return function ssError(message) {
      var errorLog = Array.prototype.slice.call(arguments);
      if (_.isString(errorLog[0])) {
        errorLog[0] = 'SSError: ' + errorLog[0];
      } else {
        errorLog.unshift('SSError: ');
      }
      ssErrorLog.error.apply(null, errorLog);
      return new Error(message);
    };
  }
};
