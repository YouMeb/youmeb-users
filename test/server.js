'use strict';

var path = require('path');
var youmeb = require('./app/node_modules/youmeb');
var crypto = require('crypto');
var uuid = require('node-uuid');
var User;

before(function (done) {
  youmeb.boot(path.join(__dirname, 'app'), function (err) {
    if (err) {
      return done(err);
    }
    
    var sequelize = youmeb.injector.get('sequelize');
    var pass = crypto.createHash('sha1').update('123abC').digest('hex');

    User = sequelize.model('User');

    User
      .create({
        login: 'test',
        password: pass,
        email: 'test@test.me',
        display: 'test',
        uuid: uuid.v4()
      })
      .success(function () {
        done();
      })
      .error(done);
  });
});

after(function (done) {
  if (!User) {
    return done();
  }
  User
    .destroy({login: 'test'})
    .success(done)
    .error(done);
});

module.exports = youmeb;
