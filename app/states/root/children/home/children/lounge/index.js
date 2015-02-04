var registered = require('registerState')(__filename, require('ngCommon'), {
  url: null,
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    // styles: require('./index.styl'),
  }
});

module.exports = registered.state;
