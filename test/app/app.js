'use strict';

var path = require('path');
var mysql = require('mysql');
var crypto = require('crypto');

(function () {
  var oldCreateConnection = mysql.createConnection;
  mysql.createConnection = function (config) {
    config.supportBigNumbers = true;
    config.bigNumberStrings = true;
    return oldCreateConnection.apply(this, arguments);
  };
})();

module.exports = function (done) {

  this.express(function (app, express) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
  });

  this.routes();

  this.invoke(function ($users) {
    $users.setPasswordHasher(function (pass, done) {
      var shasum = crypto.createHash('sha1');
      done(null, shasum.update(pass).digest('hex'));
    });
  });

  done();
};
