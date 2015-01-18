'use strict';

var _ = require('lodash');

_.mixin({
  getDirectory: function getDirectory(filepath) {
    return filepath.substr(0, _.lastIndexOf(filepath, '/'));
  }
});
