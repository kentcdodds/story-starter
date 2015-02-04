module.exports = require('registerState')(__filename, require('ngCommon'), {
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    styles: require('./index.styl'),
    displayName: 'Login',
    activationEvents: ['login', 'unauthenticated']
  }
}).state;
