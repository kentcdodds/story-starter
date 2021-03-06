module.exports = require('registerState')(__filename, require('ngCommon'), {
  url: null,
  template: null,
  resolve: {
    authenticationToken: /* @ngInject */ function(AuthToken) {
      return AuthToken.getToken();
    },
    user: /* @ngInject */ function(authenticationToken, stateUtils, $stateParams) {
      if (!authenticationToken) {
        stateUtils.eventNavigate('unauthenticated', $stateParams);
      } else {
        stateUtils.eventNavigate('goHome', $stateParams);
      }
    }
  },
  data: {
    activationEvents: ['noRouteMatch', 'authenticated']
  }
}).state;
