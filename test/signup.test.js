'use strict';

var youmeb = require('./server');
var expect = require('chai').expect;
var request = require('request');

describe('post /api/user/signup', function () {
  
  it('Should create an user in database', function (done) {

    request.post({
      url: 'http://localhost:3000/api/user/signup',
      json: {
        login: 'poying',
        password: '123abC',
        email: 'poying@test.me'
      }
    }, function (err, res, data) {
      if (err) {
        throw err;
      }
      expect(data.success).to.be.true;
      expect(data.data.user.login).to.equal('poying');
      done();
    });

  });

  after(function (done) {
    var sequelize = youmeb.injector.get('sequelize');
    var User = sequelize.model('User');
    User
      .destroy({login: 'poying'})
      .success(done)
      .error(done);
  });

});
