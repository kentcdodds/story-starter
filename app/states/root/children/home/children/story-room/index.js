var registered = require('registerState')(__filename, require('ngCommon'), {
  url: 'story-room',
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    // styles: require('./index.styl'),
    activationEvents: ['newStory']
  }
});

module.exports = registered.state;
