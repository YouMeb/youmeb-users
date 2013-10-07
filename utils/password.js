'use strict';

var passUtil = module.exports = {};

passUtil.strength = function (pass) {
  return pass.length > 3 && /\d/.test(pass) && /[a-z]/.test(pass) && /[A-Z]/.test(pass);
};
