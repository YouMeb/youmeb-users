'use strict';

module.exports = function ($errors) {

  $errors.define('Service.Users.PasswordTooWeak', 'Password too weak.');
  $errors.define('Service.Users.LoginIsEmpty', 'Login cannot be empty.');
  $errors.define('Service.Users.EmailIsNotValid', 'The format of user email is not valid.');
  $errors.define('Service.Users.EmailOrLoginNameIsAlreadyTaken', 'Email or login is already taken');

};
