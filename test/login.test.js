'use strict';

var youmeb = require('./server');
var expect = require('chai').expect;
var request = require('request');
var crypto = require('crypto');

describe('post /api/rest-auth/login', function () {
  var nonce;
  var key;

  before(function (done) {
    request.get({
      url: 'http://localhost:3000/api/rest-auth/nonce',
      json: {}
    }, function (err, res, data) {
      if (err) {
        return done(err);
      }
      nonce = data.data.nonce;
      key = data.data.key;
      done();
    });
  });
  
  it('Should get an token', function (done) {
    var cnonce = '123123abcabc';
    var pass = crypto.createHash('sha1').update('123abC').digest('hex');
    var hash = crypto.createHash('sha1').update([pass, nonce, cnonce].sort().join('')).digest('hex');

    request.post({
      url: 'http://localhost:3000/api/rest-auth/login',
      json: {
        hash: hash,
        key: key,
        cnonce: cnonce,
        login: 'test'
      }
    }, function (err, res, data) {
      if (err) {
        throw err;
      }
      expect(data.success).to.be.true;
      expect(data.data.loginSuccess).to.be.true;
      expect(data.data.token).to.be.a('string');
      done();
    });

  });

});
