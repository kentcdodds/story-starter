/*
 AZDOCS
 This just holds some miscellaneous functions that are helpful/useful. Think of it as our own lodash. If it ever gets
 too big, we'll want to break it out.

 You can inject it into the config via `utilsProvider` or anything else via `utils`.

 # `deepMerge`

 Behaves just like angular.extend except instead of using references for child non-primatives it actually goes down the
 entire object chain to assign the actual values

 # `reverseDeepMerge`

 Behaves like `deepMerge` except it operates in reverse where the first object's properties take priority.

 # `getVal`

 Instead of

 ```javascript
 if (a && a.b && a.b.c && a.b.c.d && a.b.c.d.e) {
 a.b.c.d.e()
 }
 ```

 we now can do

 ```javascript
 if (utils.getVal(a, 'b/c/d/e') {
 a.b.c.d.e();
 }
 ```

 */

let internal = {};
let objectPrototype = Object.getPrototypeOf({});
let arrayPrototype = Object.getPrototypeOf([]);
let _ = require('lodash');

let utils = module.exports = {
  promiseMinTime: promiseMinTime,
  paramify: paramify,
  stopBubble: stopBubble,
  arrayify: arrayify,
  titleCase: titleCase,
  capitalizeFirstLetter: capitalizeFirstLetter,
  compileUrlWithParams: compileUrlWithParams,
  reverseDeepMerge: getDeepMerge(true, true),
  deepMerge: getDeepMerge(false),
  definedDeepMerge: getDeepMerge(true),
  getVal: getVal,
  invoke: invoke,
  newTab: newTab,
  flatten: flatten
};


module.exports.createProvider = ngModule => {
  ngModule.provider('utils', utilsProvider);

  utilsProvider.tests = ON_TEST ? require('./utils.test')(ngModule) : null;

  function /* @ngInject */ utilsProvider(_) {
    _.extend(this, utils, {
      $get: function utilsGet($q, $timeout) {
        internal.$q = $q;
        internal.$timeout = $timeout;
        return this;
      }
    });
  }
};

function paramify(params) {
  var myParams = angular.copy(params);
  var queryString = [];
  _.each(myParams, function(param, key) {
    var name = encodeURIComponent(key);
    if (_.isArray(param)) {
      _.each(param, function(p) {
        queryString.push(name + '=' + encodeURIComponent(p));
      });
    }
    else if (!_.isNull(param)) {
      queryString.push(name + '=' + encodeURIComponent(param));
    }
  });
  return queryString.join('&');
}

function stopBubble(event) {
  invoke(event, 'preventDefault')();
  invoke(event, 'stopPropagation')();
}

function promiseMinTime(promise, milliseconds) {
  var timeoutPromise = internal.$timeout(angular.noop, milliseconds);
  return internal.$q.all([promise, timeoutPromise]).then(function(results) {
    return results[0];
  }, function(results) {
    return timeoutPromise.then(function() {
      throw results;
    });
  });
}

function compileUrlWithParams(url, params) {
  var compiledUrl = url;
  var paramArgs = Array.prototype.slice.call(arguments, 1);
  params = angular.extend.apply(angular, paramArgs);
  angular.forEach(params, function(paramValue, paramName) {
    compiledUrl = compiledUrl
      .replace(new RegExp(':' + paramName + '$', 'gi'), paramValue) // end of url
      .replace(new RegExp(':' + paramName + '\/', 'gi'), paramValue + '\/'); // middle of url
  });
  return compiledUrl;
}

function getDeepMerge(defined, reverse) {
  var each = reverse ? _.eachRight : _.each;
  return function deepMerge() {
    var realRes = arguments[0];
    var res = reverse ? {} : realRes;
    each(arguments, function(src, index) {
      if (src && (index > 0 || reverse)) {
        _.each(src, function(val, prop) {
          /* jshint maxcomplexity:7 */
          if (typeof val === 'object' && !_.isNull(val) &&
            (Object.getPrototypeOf(val) === objectPrototype || Object.getPrototypeOf(val) === arrayPrototype)) {
            var deepRes = res[prop];
            if (!deepRes && _.isArray(val)) {
              deepRes = [];
            } else if (!deepRes) {
              deepRes = {};
            }
            res[prop] = deepMerge(deepRes, val);
          } else if (!defined || (defined && !_.isUndefined(val))) {
            res[prop] = val;
          }
        });
      }
    });
    if (reverse) {
      _.each(realRes, function(val, prop) {
        delete realRes[prop];
      });
      _.each(res, function(val, prop) {
        realRes[prop] = val;
      });
      res = realRes;
    }
    return res;
  };
}


function arrayify(obj) {
  return _.isUndefined(obj) ? obj : angular.isArray(obj) ? obj : [obj];
}

function titleCase(string) {
  return string.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function capitalizeFirstLetter(string) {
  return string && string.trim().charAt(0).toUpperCase() + string.trim().slice(1);
}

function getVal(obj, path) {
  var steps = path.split(/\//);
  var currVal = obj;

  while (steps.length) {
    var key = steps.shift();
    if (currVal && typeof(currVal[key]) !== 'undefined') {
      currVal = currVal[key];
    } else {
      currVal = null;
      break;
    }
  }

  return currVal;
}

function invoke(obj, path) {
  var fn = getVal(obj, path);
  return _.bind(fn, obj) || angular.noop;
}

function newTab(url) {
  window.open(location.origin + url, '_blank');
}

function flatten(items, property, flatItems = []) {
  _.each(items, function(item) {
    flatItems.push(item);
    flatten(getVal(item, property), property, flatItems);
  });
  return flatItems;
}
