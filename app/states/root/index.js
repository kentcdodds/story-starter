module.exports = require('registerState')(__filename, require('ngCommon'), {
  url: null,
  abstract: true,
  data: {
    children: require('./children'),
    styles: require('./index.styl')
  }
}).state;
