var registered = require('registerState')(__filename, require('ngCommon'), {
  url: 'library',
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    // styles: require('./index.styl'),
    activationEvents: ['openLibrary']
  }
});

module.exports = registered.state;
