/*
 * This is an excluded file, meaning it will be loaded in dev, but excluded in the prod build. It has utilities that are
 * awesome.
 */
/* jshint devel: true */
/* jshint maxstatements: false*/
/* jshint maxcomplexity: false */

// Angular utils
window.ss = (function() {

  /**
   * Sometimes you have two scopes that are supposedly related,
   * but you don't know how far back to go before you find that relation
   *
   * Usage:
   *
   * var closestParent = closestScopeParent(scope1, scope2);
   * // or
   * var closestParent = closestScopeParent('003', '0M4');
   * @param scope1
   * @param scope2
   * @returns {*}
   */
  function closestScopeParent(scope1, scope2) {
    scope1 = _makeScopeReference(scope1);
    scope2 = _makeScopeReference(scope2);
    var bump1 = false;
    while (scope1 !== scope2 && scope1 && scope2) {
      if (bump1) {
        scope1 = scope1.$parent;
      } else {
        scope2 = scope2.$parent;
      }
      bump1 = !bump1;
    }
    return scope1;
  }

  closestScopeParent.help = 'Find the lowest common ancestor of two scopes. Provide scopes by reference or id.';

  /**
   * Sometimes you have a scope ID and you have no idea what element
   * that scope belongs to, use this to find the element.
   *
   * Usage:
   *
   * var element = getElementByScopeId('003');
   * // NOTE: Some scopes don't have an element (apparently)...
   * @param scope
   * @returns {*}
   */
  function getElementByScope(scope) {
    if (Array.isArray(scope)) {
      return scope.map(function(s) {
        return getElementByScope(s);
      });
    }
    scope = _makeScopeReference(scope);
    var ngScopes = getAllScopeElements();
    for (var i = 0; i < ngScopes.length; i++) {
      var element = angular.element(ngScopes.item(i));
      var aScope = element.scope();
      var isolateScope = element.isolateScope();
      if ((aScope && scope.$id === aScope.$id) || (isolateScope && scope.$id === isolateScope.$id)) {
        return element;
      }
    }
  }

  getElementByScope.help = 'Find the root element of a scope by the scope\'s reference or id.';

  /**
   * Scopes are on elements with the .ng-scope class on them.
   * @returns {NodeList}
   */
  function getAllScopeElements() {
    return document.documentElement.querySelectorAll('.ng-scope');
  }

  getAllScopeElements.help = 'Find the root element of all scopes on the page.';

  function getAllScopes(scope) {
    var scopes = [];
    iterateScopes(scope, scopes.push.bind(scopes));
    return scopes;
  }

  getAllScopes.help = 'Get all the scopes on the page as an array';
  getAllScopes.args = ['The scope to start on (optional, defaults to $rootScope)'];

  /**
   * When you have an id for a scope, but not the scope itself.
   * Usage:
   * var scope25 = getScopeById(25);
   * @param id
   * @returns {*}
   */
  function getScopeById(id) {
    var myScope = null;
    iterateScopes(function(scope) {
      if (scope.$id === id) {
        myScope = scope;
        return false;
      }
    });
    return myScope;
  }

  getScopeById.help = 'Get a reference to a scope by the id of the scope';

  /**
   * Sometimes you want to do the same thing to all scopes on a page, or find
   * which scope has a specific property.
   * Provide the starting scope (or it will use the $rootScope) and it'll
   * iterate through all scopes below starting with the given scope
   *
   * Usage:

   * iterateScopes($scope, function(scope) {
     *   console.log(scope);
     * });

   * iterateScopes(function(scope) {
     *   console.log(scope);
     * });

   * iterateScopes(function(scope) {
     *   if (scope.hasOwnProperty('propOfInterest')) {
     *     debugger;
     *     // so you can do stuff with that scope
     *   }
     * });

   * var coolScope;
   * iterateScopes(function(scope) {
     *   if (scope.isCool) {
     *     coolScope = scope;
     *     return false; // early exit
     *   }
     * });
   * @param current
   * @param fn
   * @returns {*}
   */
  function iterateScopes(current, fn) {
    if (typeof current === 'function') {
      fn = current;
      current = null;
    }
    current = current || getRootScope();
    current = _makeScopeReference(current);
    var ret = fn(current);
    if (ret === false) {
      return ret;
    }
    return iterateChildren(current, fn);
  }

  iterateScopes.help = 'Iterate through all scopes on the page.';
  iterateScopes.args = [
    'the scope to start on (optional, and can be id)',
    'the function to invoke with the scopes: fn(scope)'
  ];

  function iterateSiblings(start, fn) {
    var ret;
    while (!!(start = start.$$nextSibling)) {
      ret = fn(start);
      if (ret === false) {
        break;
      }

      ret = iterateChildren(start, fn);
      if (ret === false) {
        break;
      }
    }
    return ret;
  }

  function iterateChildren(start, fn) {
    var ret;
    while (!!(start = start.$$childHead)) {
      ret = fn(start);
      if (ret === false) {
        break;
      }

      ret = iterateSiblings(start, fn);
      if (ret === false) {
        break;
      }
    }
    return ret;
  }

  function getScopesWithProperty(propertyName, start) {
    var scopes = [];
    iterateScopes(start, function(scope) {
      if (scope.hasOwnProperty(propertyName)) {
        scopes.push(scope);
      }
    });
    return scopes;
  }

  getScopesWithProperty.help = 'Get all scopes that have the given property as their own.';

  /**
   * Get the root scope.
   * @returns {*}
   */
  function getRootScope() {
    var firstElementWithScope = document.documentElement.querySelector('.ng-scope');
    var scope = angular.element(firstElementWithScope).scope();
    return scope.$root;
  }

  getRootScope.help = 'Get the $rootScope';

  /**
   * Get watcher count for an element and all of its children
   * @param element
   * @returns {number}
   */
  function getWatcherCount(element) {
    var watcherCount = 0;
    if (!element) {
      element = document.documentElement;
    }
    var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
    var scopeWatchers = getWatchersFromScope(element.data().$scope);
    var watchers = scopeWatchers.concat(isolateWatchers);
    watcherCount += watchers.length;
    angular.forEach(element.children(), function(childElement) {
      watcherCount += getWatcherCount(angular.element(childElement));
    });
    return watcherCount;
  }

  getWatcherCount.help = 'Get the current watch count from an element and its children';
  getWatcherCount.args = ['the element to start on (optional: defaults to documentElement)'];

  function getWatchersFromScope(scope) {
    scope = _makeScopeReference(scope);
    return scope && scope.$$watchers ? scope.$$watchers : [];
  }

  getWatchersFromScope.help = 'Get the given scope\'s $$watchers';
  getWatchersFromScope.args = ['scope by reference or id'];

  function scopeIsRoot(scope) {
    scope = _makeScopeReference(scope);
    return scope && scope.$root === scope;
  }

  scopeIsRoot.help = 'Returns true if the given scope (or scope id) is equal to $rootScope';

  function help(fn) {
    /* jshint -W040 */
    var message;
    var args;
    var theFn;
    var fns = Object.keys(this);
    if (fn && !this[fn] && !fns[fn]) {
      throw new Error('This has no function called ' + fn);
    } else if (typeof fn !== 'undefined') {
      theFn = this[fn] || this[fns[fn]];
      message = theFn.name + ': ' + (theFn.help || 'no help available') + '\n';
      args = _getDependencies(theFn);
      if (args.length) {
        message += 'Parameters:\n\t';
      } else {
        message += 'No parameters';
      }

      message += args.map(function(arg, index) {
        return '[' + index + '] ' + args[index] + (theFn.args ? ': ' + theFn.args[index] : '');
      }).join('\n\t');

      console.log(message);
      return;
    }

    message = fns.map(function(key, index) {
      return '[' + index + '] ' + key + ': ' + this[key].help || '';
    }.bind(this));
    console.log(message.join('\n'));
  }

  help.help = 'Shows this help output. Pass the name or number of a function for more info.';
  help.args = [
    'The name or number of a function to get extra info'
  ];


  return {
    closestScopeParent: closestScopeParent,
    getScopeById: getScopeById,
    getElementByScope: getElementByScope,
    getAllScopeElements: getAllScopeElements,
    getAllScopes: getAllScopes,
    iterateScopes: iterateScopes,
    getWatcherCount: getWatcherCount,
    getWatchersFromScope: getWatchersFromScope,
    getRootScope: getRootScope,
    scopeIsRoot: scopeIsRoot,
    getScopesWithProperty: getScopesWithProperty,
    help: help
  };

  // UTILS

  function _makeScopeReference(scope) {
    if (_isScopeId(scope)) {
      scope = getScopeById(scope);
    }
    return scope;
  }

  function _isScopeId(scope) {
    return typeof scope === 'string' || typeof scope === 'number';
  }

  function _getDependencies(func) {
    // strip comments
    var fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    // get argument names
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
    if (result === null) {
      result = [];
    }
    return result;
  }

})();

console.log('ss utils installed, run ss.help() for more information');


var intervalId = setInterval(function() {
  var firstScopeEl = document.querySelector('.ng-scope');
  var $injector = angular.element(firstScopeEl).injector();
  if (!$injector) {
    return;
  }
  clearInterval(intervalId);
  window.$injector = $injector;
  var injectables = [
    '$rootScope', '$http', '$q', '$state', '$stateParams',
    '$location', '$log', '$timeout', 'formlyConfig', '$parse',
    '$templateCache', 'utils', 'stateUtils', '$filter', '$compile'
  ];
  injectables.forEach(function(injectable) {
    window[injectable] = $injector.get(injectable);
  });

  // add stuff to $rootScope that make debugging in templates nicer
  window.$rootScope.onDev = true;
}, 10); // wait for bootstrap


// window errors
window.onerror = function(errorMsg, url, lineNumber, columnNumber, errorObject) {
  if (/<omitted>/.test(errorMsg)) {
    console.error('Error: ' + errorObject ? errorObject.message : errorMsg);
  }
};
