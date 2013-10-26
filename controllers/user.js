'use strict';

var callbackWrapper = require('callback-wrapper');
var emailValid = require('email-validation').valid;
var utils = require('../utils');
var uuid = require('node-uuid');

module.exports = function ($youmeb, $errors, $restAuth, $users, $sequelize) {
  var User = $sequelize.model('User');

  this.$({
    name: '',
    path: ''
  });

  this.signup = {
    name: 'signup',
    path: '/signup',
    methods: ['post'],
    handler: function (req, res, next) {
      var pass = (req.body.password || '').trim();
      var login = (req.body.login || '').trim();
      var email = (req.body.email || '').trim();
      var display = (req.body.display || '').trim() || login;

      if (!utils.password.strength(pass)) {
        return res.jsonp({
          success: false,
          error: $errors.generate('Service.Users.PasswordTooWeak')
        });
      }
      
      if (!login) {
        return res.jsonp({
          success: false,
          error: $errors.generate('Service.Users.LoginIsEmpty')
        });
      }

      try {
        emailValid(email)
      } catch (e) {
        return res.jsonp({
          success: false,
          error: $errors.generate('Service.Users.EmailIsNotValid')
        });
      }
      
      $users.passwordHasher(pass, callbackWrapper(next, function (err, hash) {
        User
          .count({
            where: ['`login` = ? OR `email` = ?', login, email]
          })
          .error(next)
          .success(function (count) {
            if (count !== 0) {
              return res.jsonp({
                success: false,
                error: $errors.generate('Service.Users.EmailOrLoginNameIsAlreadyTaken')
              });
            }
            User
              .create({
                login: login,
                password: hash,
                display: display,
                email: email,
                uuid: uuid.v4()
              })
              .error(next)
              .success(function (user) {
                $users.emit('signup-success', user);
                var data = utils.base.clone(user.dataValues);
                delete data.password;
                res.jsonp({
                  success: true,
                  data: {
                    user: data
                  }
                });
              });
          });
      }));
    }
  };

  this.me = {
    name: 'me',
    path: '/me',
    handler: function (req, res, next) {
      var token = (req.body.token || req.query.token || '').trim();
      $restAuth.getUser(token, callbackWrapper(next, function (err, login) {
        User
          .find({
            where: ['`login` = ?', login],
            limit: 1
          })
          .error(next)
          .success(function (user) {
            var data = utils.base.clone(user.dataValues);
            delete data.password;
            res.jsonp({
              success: true,
              data: {
                user: data
              }
            });
          });
      }));
    }
  };

};
