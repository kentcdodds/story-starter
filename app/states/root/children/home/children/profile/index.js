var registered = require('registerState')(__filename, require('ngCommon'), {
  url: 'profile',
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    activationEvents: ['openProfile']
  }
});

module.exports = registered.state;
