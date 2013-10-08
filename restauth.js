'use strict';

var callbackWrapper = require('callback-wrapper');
var uid = require('uid2');

module.exports = function (redisClient, done) {
  return function ($youmeb, $restAuth, $sequelize) {
    var User = $sequelize.model('User');
    var nonceExpire = $youmeb.config.get('users.nonce-expire') || 300;
    var tokenExpire = $youmeb.config.get('users.token-expire') || 604800;
    
    addEventListeners();

    function addEventListeners() {
      $restAuth.on('saveNonce', saveNonce);
      $restAuth.on('getNonce', getNonce);
      $restAuth.on('saveToken', saveToken);
      $restAuth.on('getPassword', getPassword);
      $restAuth.on('getUser', getUser);
    }

    function saveNonce(nonce, returnId, done) {
      generateNonceId(callbackWrapper(done, function (err, id) {
        var key = getNonceKey(id);
        redisClient.set(key, nonce);
        redisClient.expire(key, nonceExpire);
        returnId(id);
        done();
      }));
    }

    function getNonce(id, returnNonce, done) {
      var key = getNonceKey(id);
      redisClient.get(key, callbackWrapper(done, function (err, nonce) {
        returnNonce(nonce);
        done();
      }));
    }

    function saveToken(login, returnId, done) {
      generateTokenId(callbackWrapper(done, function (err, id) {
        var key = getTokenKey(id);
        redisClient.set(key, login);
        redisClient.expire(key, tokenExpire);
        returnId(id);
        done();
      }));
    }

    function getPassword(login, returnPassword, done) {
      User.find({
        where: ['`login` = ?', login],
        attributes: ['password'],
        limit: 1
      })
        .success(function (user) {
          returnPassword(user && user.password);
          done();
        })
        .error(done);
    }

    function getUser(token, returnUser, done) {
      var key = getTokenKey(token);
      redisClient.get(key, callbackWrapper(done, function (err, login) {
        returnUser(login);
        done();
      }));
    }

    function generateNonceId(done) {
      generateId(function (id) {
        return getNonceKey(id);
      }, done);
    }

    function generateTokenId(done) {
      generateId(function (id) {
        return getTokenKey(id);
      }, done);
    }

    function generateId(keyGetter, done) {
      var id = uid(24);
      var key = keyGetter(id);
      redisClient.exists(key, callbackWrapper(done, function (err, exists) {
        if (exists) {
          generateId(keyGetter, done);
        } else {
          done(null, id);
        }
      }));
    }

    function getNonceKey(id) {
      return id2key('nonce-', id);
    }

    function getTokenKey(id) {
      return id2key('token-', id);
    }

    function id2key(prefix, id) {
      return prefix + id;
    }

    done();
  };
};
