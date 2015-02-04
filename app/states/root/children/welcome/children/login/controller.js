// @ngInject
module.exports = function LoginCtrl() {
  var vm = this;

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
};
