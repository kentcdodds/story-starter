module.exports = ngModule => {
  ngModule.directive('ssMessages', ssMessages);

  function ssMessages($templateCache) {
    var templateKey = 'formly-ss-form-messages-template';
    $templateCache.put(templateKey, require('./ss-messages.html'));
    return {
      restrict: 'A',
      priority: 1,
      replace: true,
      template: function(el, attrs) {
        var formControl = attrs.ssMessages;
        var field = attrs.options;
        var shouldShow = attrs.showMessages || `${formControl}.$error && ${formControl}.$touched`;
        /* jshint -W033 */
        return `
          <div ng-if="${shouldShow}"
               ng-messages="${formControl}.$error"
               class="az-form-messages"
               ng-messages-include="${templateKey}">
            <div ng-repeat="(name, message) in ::${field}.messages"
                 ng-message="{{::name}}" class="ss-messages__message">
              {{message(${field})}}
            </div>
          </div>
        `;
      }
    };
  }
};
