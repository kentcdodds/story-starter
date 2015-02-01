module.exports = ngModule => {
  ngModule.directive('ngForm', ngForm);

  function ngForm(_) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        if (!attrs.ngSubmit) {
          return;
        }
        var ngForm = scope.$eval(attrs.name);
        if (ngForm) {
          ngForm.ssSubmit = function() {
            if (ngForm.$invalid) {
              return;
            }
            var context = scope;
            if (attrs.hasOwnProperty('submitFormOnParent')) {
              context = scope.$parent;
            }
            ngForm.ssSubmitting = context.$eval(attrs.ngSubmit);
            return ngForm.ssSubmitting;
          };
          element.on('keyup', function(event) {
            if (event.which === 13 && fromApprovedSource(event.target)) {
              submitFormFromEvent(event);
            }
          });
          var submitButton = element.find('[type=submit]');
          if (submitButton.length === 1) {
            submitButton.on('keyup', function(event) {
              if (event.which === 32 || event.which === 13) {
                submitFormFromEvent(event);
              }
            });
            submitButton.on('click', submitFormFromEvent);
          } else if (!_.isEmpty(submitButton)) {
            throw new Error('Forms should only have one submit button');
          }
        }

        function submitFormFromEvent() {
          ngForm.ssSubmit();
          scope.$apply();
        }

        function fromApprovedSource(target) {
          // note, select doesn't work because it fires a keyup when you select an option :-(
          var isSubmittingNodeType = target.nodeName === 'INPUT';
          return isSubmittingNodeType || isSubmitButton(target);
        }

        function isSubmitButton(target) {
          var isButton = target.nodeName === 'BUTTON';
          return isButton && target.getAttribute('type') === 'submit';
        }
      }
    };
  }
};
