module.exports = ngModule => {
  ngModule.factory('AuthToken', AuthTokenFactory);

  function AuthTokenFactory($window) {
    var tokenKey = 'auth-token';
    var store = $window.localStorage;
    var token = getToken();
    return {
      getToken: getToken,
      setToken: setToken
    };

    function getToken() {
      if (!token) {
        token = store.getItem(tokenKey);
      }
      return token;
    }

    function setToken(givenToken) {
      token = givenToken;
      if (givenToken) {
        store.setItem(tokenKey, givenToken);
      } else {
        store.removeItem(tokenKey);
      }
    }
  }
};
