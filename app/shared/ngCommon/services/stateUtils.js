let _ = require('lodash');
let utils = require('utils');
let internal = {};
let stateResponders = {};

let stateUtils = module.exports = {
  resolveParameter: resolveParameter,
  resolveIdentity: resolveIdentity,
  resolveFirst: resolveFirst,
  waitFor: waitFor,
  resolveLocalStorage: resolveLocalStorage,
  getStates: getStates,
  eventNavigate: eventNavigate,
  eventHref: eventHref,
  includes: includes,
  goBack: function goBackWrapper() {
    internal.$injector.invoke(['$state', goBack]);
  }
};


function stateUtilsProvider() {
  /* jshint validthis:true */
  _.extend(this, stateUtils, {
    $get: function stateUtilsGet($injector) {
      _.extend(internal, {$injector});
      return this;
    }
  });
}

module.exports.createProvider = ngModule => {
  ngModule.provider('stateUtils', stateUtilsProvider)
    .constant('EMPTY_OBJECT', {}).run(function(stateUtils) {
    });
};

function resolveParameter(param) {
  return /*@ngInject*/ function($stateParams) {
    return $stateParams[param];
  };
}

function resolveFirst(injectable, fn) {
  function first(theInjectable, $q) {
    if (fn) {
      return fn(theInjectable[0]);
    } else {
      return $q.when(theInjectable[0]);
    }
  }

  first.$inject = [injectable, '$q'];
  return first;
}

function resolveIdentity(val) {
  return function identity() {
    return val;
  };
}

function waitFor(dependencies, resolve) {
  function resolver() {
    return internal.$injector.invoke(resolve);
  }

  resolver.$inject = arrayify(dependencies);
  return resolver;
}

function resolveLocalStorage(key) {
  return /*@ngInject*/ function localStorage($window) {
    return $window.localStorage.getItem(key);
  };
}

function goBack($state) {
  $state.go($state.previousState, $state.previousParams);
}

function arrayify(obj) {
  return _.isArray(obj) ? obj : [obj];
}

function getStates(rootStates) {
  // setup states
  let states = [];
  _.each(rootStates, function(state) {
    state.data = state.data || {};
    setupModuleStates(state);
  });

  return states;

  function setupModuleStates(originalState) {
    /* jshint maxcomplexity:7 */
    var state = _.cloneDeep(originalState);

    // if the state is null, then explicitly set to null, otherwise add a '/' and the url
    state.url = _.isNull(state.url) ? null : '/' + (state.url || '');

    state.data.module = state.name;
    state.name = getStateName(state);
    _.each(utils.arrayify(state.data.activationEvents), event => {
      if (stateResponders[event]) {
        throw new Error(
          `Only one state can respond to an activation event: ${event}, ${stateResponders[event].url}, ${state.url}`
        );
      }
      stateResponders[event] = state;
    });

    state.data.children = _.map(state.data.children, function(child) {
      child.data = child.data || {};
      child.data.parent = state;
      return setupModuleStates(child);
    });

    if (state.abstract && state.data && state.data.nav && state.data.nav.groupRoot && !_.isEmpty(state.data.children)) {
      state.data.nav.defaultState = getDefaultState(state.data.children[0]).name;
    }
    states.push(state);
    return state;
  }

  function getStateName(state) {
    var names = [];
    var parent = state;
    while(parent) {
      names.unshift(parent.data.module);
      parent = parent.data.parent;
    }
    return names.join('.');
  }

  function getDefaultState(defaultState) {
    if (!defaultState) {
      throw new Error('Cannot set a default state!');
    }
    if (defaultState.abstract && defaultState.data && !_.isEmpty(defaultState.data.children)) {
      return getDefaultState(defaultState.data.children[0]);
    } else {
      return defaultState;
    }
  }
}

function eventNavigate(event, params, options) {
  return invokeState('go', ...arguments);
}

function eventHref(event, params, options) {
  return invokeState('href', ...arguments);
}

function invokeState(fn, event, params, options) {
  let state = getStateForEvent(event);
  let $state = internal.$injector.get('$state');
  return $state[fn](state.name, _.clone(params), options);
}

function includes(urlPartial) {
  let $location = internal.$injector.get('$location');
  let path = $location.path();
  if (_.isRegExp(urlPartial)) {
    return urlPartial.test(path);
  } else {
    return _.contains(path, urlPartial);
  }
}

function getStateForEvent(event) {
  let state = stateResponders[event];
  if (!state || !state.name) {
    throw internal.$injector.get('ssError')(
      'eventNavigate without a responder!',
      'stateResponders:', stateResponders,
      'listener args:', ...arguments
    );
  }
  return getFirstActivateableState(state);
}

function getFirstActivateableState(state) {
  let activateableState = state;
  while (activateableState && activateableState.abstract) {
    activateableState = state.data.children && state.data.children[0];
  }
  if (activateableState.abstract) {
    throw internal.$injector.get('ssError')('state has no activateable state!', state, activateableState);
  }
  return activateableState;
}
