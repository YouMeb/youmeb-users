'use strict';

var path = require('path');
var restAuth = require('./restauth');
var schema = require('./schema');

module.exports = function ($youmeb, $errors, $routes, $redis, $redisClient) {

  if (!$redis) {
    return done(new Error('You need to install the redis youmeb package.'));
  }

  // events
  this.on('init', function (config, done) {
    $routes.source(path.join(__dirname, 'controllers'));
    $youmeb.invoke(require('./errors'));
    $youmeb.invoke(require('./init')(config, done));
  });

  // attributes
  this.schema = schema;
  this.passwordHasher = function (pass, done) {
    done(null, pass);
  };

  // methods
  this.setPasswordHasher = function (fn) {
    if (typeof fn === 'function') {
      this.passwordHasher = fn;
    }
    return this;
  };

};

exports.schema = schema;

exports.createTable = function (migration, DataTypes, done) {
  migration
    .createTable('Users', schema, {
      charset: 'utf8',
      timestamp: true
    })
    .success(function () {
      migration.addIndex('Users', ['login']);
      migration.addIndex('Users', ['email']);
      done();
    })
    .error(done);
};

exports.dropTable = function (migration, DataTypes, done) {
  migration
    .dropTable('Users')
    .success(done)
    .error(done);
};
