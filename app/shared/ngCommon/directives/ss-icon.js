module.exports = ngModule => {
  ngModule.directive('ssIcon', ssIconDirective);

  var _ = require('lodash');
  var iconSets = ['action', 'alert', 'communication', 'content', 'editor', 'navigation'];
  _.each(iconSets, iconSet => require('material-design-icons/sprites/svg-sprite/svg-sprite-' + iconSet + '.css'));

  function ssIconDirective(_) {
    return {
      restrict: 'E',
      template: '<i></i>',
      replace: true,
      link: function(scope, el, attrs) {
        let size = getIconSize(attrs.size);
        el.addClass('svg-ic_' + attrs.icon.replace(/-/g, '_') + '_24px');
        el.attr('style', `height:${size}px;width:${size}px`);
        function getIconSize(size) {
          if (_.isFinite(size)) {
            return size;
          } else if (size === 'small') {
            return '12';
          } else if (_.isUndefined(size)) {
            return '24';
          } else {
            throw new Error('Must specify a valid size');
          }
        }
      }
    };

  }
};
