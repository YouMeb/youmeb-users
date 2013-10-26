'use strict';

var users = require('youmeb-users');

module.exports = function(sequelize, DataTypes) {
  var schema = users.schema(DataTypes);
  return sequelize.define('User', schema);
};
