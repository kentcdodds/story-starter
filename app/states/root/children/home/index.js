var registered = require('registerState')(__filename, require('ngCommon'), {
  url: null,
  abstract: true,
  template: require('./index.html'),
  data: {
    styles: require('./index.styl'),
    children: require('./children'),
    activationEvents: ['goHome']
  }
});

module.exports = registered.state;
