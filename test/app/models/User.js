'use strict';

var users = require('youmeb-users');

module.exports = function(sequelize, DataTypes) {
  var schema = users.schema(DataTypes);
  var User = sequelize.define('User', schema);

  (function () {
    var save = User.DAO.prototype.__proto__.save;
    User.DAO.prototype.save = function () {
      if (!this.id) {
        this.id = users.getObjectId();
      }
      return save.apply(this, arguments);
    };
  })();

  return User;
};
