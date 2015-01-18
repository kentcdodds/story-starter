'use strict';

// only have to require angular here because we have dependencies that are in bower :-(
require('angular');

// get the bower stuff :-(
window.Hammer = require('./../bower_components/hammerjs/hammer');
require('./../bower_components/angular-material/angular-material');
require('./../bower_components/angular-material/angular-material.css');

// our stuff
require('./ssApp.bootstrap.js');
