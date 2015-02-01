module.exports = ngModule => {
  ngModule.directive('ssIcon', ssIconDirective);

  function ssIconDirective() {
    return {
      restrict: 'E',
      template: '<i></i>',
      replace: true,
      link: function(scope, el, attrs) {
        el.addClass('svg-ic_' + attrs.icon.replace(/-/g, '_') + '_24px');
        el.attr('style', 'height:24px;width:24px');
      }
    };
  }
};
