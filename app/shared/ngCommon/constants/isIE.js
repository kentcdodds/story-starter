module.exports = ngModule => {
  const ua = window.navigator.userAgent;
  const isIE = ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0;
  ngModule.constant('isIE', isIE);
};
