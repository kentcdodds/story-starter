let {state, ngModule} = require('registerState')(__filename, require('ngCommon'), {
  url: null,
  abstract: true,
  template: require('./index.html'),
  controller: require('./controller'),
  data: {
    children: require('./children'),
    styles: require('./index.styl')
  },
  onEnter /*@ngInject*/ (rbb, _) {
    var backgroundImageRoot = _.getDirectory(__filename) + '/components/assets/rbb_backgrounds';
    rbb({
      root: backgroundImageRoot,
      count: 20
    });
  },
  onExit /*@ngInject*/ (rbb) {
    rbb.off();
  }
});

ngModule.constant('rbb', require('rbb'));

module.exports = state;
