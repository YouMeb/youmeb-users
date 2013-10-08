'use strict';

var fs = require('fs');
var path = require('path');
var files = fs.readdirSync(__dirname);
var utils = module.exports = {};

files.forEach(function (file) {
  if (file === 'index.js' || !/\.js/.test(file)) {
    return;
  }
  utils[path.basename(file, '.js')] = require(path.join(__dirname, file));
});
