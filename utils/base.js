'use strict';

var baseUtils = module.exports = {};

baseUtils.extend = function (obj) {
  var i;
  var newObj = {};
  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      newObj[i] = obj[i];
    }
  }
  return newObj;
};
