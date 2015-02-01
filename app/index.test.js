require('./index.common');

var _ = require('lodash');

require('angular-mocks/angular-mocks');

var ssAppModule = angular.module(require('./ssApp').name);
var $injector = angular.bootstrap(document.body, [
  ssAppModule.name
]);

// setup echo to be in test mode and prevent it from logging
var Echo = require('echo-logger');
Echo.enabled(false);
Echo.testMode = true;


// automatically create tests for everything to enforce modularity

// automatically create tests for all controllers
var testedThingsByName = {};
harnessStateControllers($injector.get('$state').get());


// automatically create tests for all registered components
var harnessedModules = {};
autoHarnessModuleInvokeQueue(ssAppModule, require('registerModule').modulePrefix);

function harnessStateControllers(allStates) {
  //var fullInvokeQueue = {};
  _.each(allStates, function(state) {
    if (!state.controller) {
      return;
    }
    var resolves = mockResolves(state);
    createControllerTest(state.controller, state.data.module, resolves);
  });

  function mockResolves(state) {
    var parent = state;
    var resolves = {};
    while(parent) {
      _.each(parent.resolve, (resolve, key) => resolves[key] = {});
      parent = parent.data.parent;
    }
    return resolves;
  }

  function createControllerTest(controller, ngModuleName, resolves) {
    describe('controller ' + controller.name, function() {
      beforeEach(window.module(ngModuleName));

      it('should not use anything it does not explicitly depend on', inject(function($injector) {
        expectControllerToNotMissDependencies(controller, $injector, _.assign({$scope: {}}, resolves));
      }));
    });
  }
}

// auto-harness components that don't have tests setup
// this helps to enforce modularity
function autoHarnessModuleInvokeQueue(ngModule, internalModulePrefix) {
  var testableComponentTypes = ['directive', 'factory', 'provider', 'register'];
  if (harnessedModules[ngModule.name]) {
    return;
  }
  harnessedModules[ngModule.name] = true;
  _.each(getComponents(ngModule), component => attachTestHarnesses(component, ngModule));
  _.each(getModuleDependencies(ngModule, internalModulePrefix), depModule => {
    autoHarnessModuleInvokeQueue(depModule, internalModulePrefix);
  });

  function getComponents(ngModule) {
    return _.chain(ngModule._invokeQueue)
      .filter(component => _.contains(testableComponentTypes, component[1]))
      .map(component => {
        var type = component[1];
        var name = component[2][0];
        var definition = component[2][1];
        return {name, definition, type};
      })
      .value();
  }

  function attachTestHarnesses(component, ngModule) {
    if (testedThingsByName['component' + component.name]) {
      return;
    }
    testedThingsByName['component' + component.name] = {component, ngModule};
    createGenericTestHarness(component, ngModule.name);
  }

  function getModuleDependencies(ngModule, prefix) {
    return _.chain(ngModule.requires)
      .filter((name) => name.indexOf(prefix) === 0)
      .map((name) => angular.module(name))
      .value();
  }

  function createGenericTestHarness(component, ngModuleName) {
    describe(component.type + ' ' + component.name, function() {
      beforeEach(window.module(ngModuleName));


      it('should not use anything it does not explicitly depend on', function() {
        expect(true).to.be.true;
      });

      if (component.type === 'directive') {
        it('should not have a controller that uses anything it should not', inject(function($injector) {
          var ddo = $injector.invoke(component.definition);
          if (ddo.controller) {
            expectControllerToNotMissDependencies(ddo.controller, $injector, {
              $scope: {},
              $element: {},
              $attrs: {}
            });
          }
        }));
      }
    });
  }
}

function expectControllerToNotMissDependencies(controller, $injector, locals) {
  controller = _.isString(controller) ? $injector.get(controller) : controller;
  var controllerDeps = getDependencies(controller);
  var isMissing = true;
  var missingDependencies = _.where(controllerDeps, function(dep) {
    if (!_.isUndefined(locals[dep])) {
      return !isMissing;
    }
    try {
      $injector.get(dep);
      return !isMissing;
    } catch(e) {
      return isMissing;
    }
  });
  expect(missingDependencies,
    `The controller ${controller.name} has dependencies not available in its module or its module's dependencies! "` +
    `${missingDependencies.join(', ')}"`
  ).to.be.empty;


  function getDependencies(func) {
    if (func.$inject) {
      return func.$inject;
    } else if (_.isArray(func)) {
      return func.slice(0, func.length - 1);
    }
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null) {
      result = [];
    }
    return result;
  }
}

