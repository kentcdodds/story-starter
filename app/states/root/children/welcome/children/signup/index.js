module.exports = require('registerState')(__filename, require('ngCommon'), {
  url: 'signup',
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    displayName: 'Sign Up',
    activationEvents: ['signup']
  }
}).state;
