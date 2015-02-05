var registered = require('registerState')(__filename, require('ngCommon'), {
  url: 'logout',
  onEnter: /* @ngInject */ function(AuthToken, stateUtils) {
    AuthToken.setToken();
    stateUtils.eventNavigate('unauthenticated');
  },
  data: {
    activationEvents: 'logout'
  }
});

module.exports = registered.state;
