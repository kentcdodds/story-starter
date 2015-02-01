module.exports = ngModule => {
  require('./stateUtils').createProvider(ngModule);
  require('./utils').createProvider(ngModule);
  require('./ssError')(ngModule);
};
