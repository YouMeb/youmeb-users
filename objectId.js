'use strict';

var ObjectId = require('bson').ObjectId;

ObjectId.index = Math.floor(Math.random() * 4095);

module.exports = function () {
  return new ObjectId();
};
