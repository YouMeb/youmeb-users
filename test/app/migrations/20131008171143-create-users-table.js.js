'use strict';

var users = require('youmeb-users');

module.exports = {
  up: users.createTable,
  down: users.dropTable
};
