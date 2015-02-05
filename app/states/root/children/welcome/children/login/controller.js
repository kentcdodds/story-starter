// @ngInject
module.exports = function LoginCtrl(AuthToken, stateUtils) {
  var vm = this;

  vm.login = login;

  vm.loginModel = {};
  vm.loginFields = [
    {
      type: 'input',
      key: 'email',
      templateOptions: {
        type: 'email',
        label: 'Email Address',
        required: true,
        focus: true
      }
    },
    {
      type: 'input',
      key: 'password',
      templateOptions: {
        type: 'password',
        label: 'Password',
        required: true
      }
    }
  ];

  function login(info) {
    AuthToken.setToken(angular.toJson(info));
    stateUtils.eventNavigate('authenticated');
  }
};
