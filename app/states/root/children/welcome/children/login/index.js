module.exports = require('registerState')(__filename, require('ngCommon'), {
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    displayName: 'Login',
    activationEvents: ['login']
  }
}).state;
