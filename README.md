youmeb-users
============

[![Build Status](https://travis-ci.org/YouMeb/youmeb-users.png?branch=master)](https://travis-ci.org/YouMeb/youmeb-users)

## Dependencies

* youmeb-redis
* youmeb-rest-auth
* youmeb-sequelize

You must install :

* Redis : How to install this? see that `http://redis.io/download` or  [Click me](http://redis.io/download)
* mysql
* YoumebJS project !!! How to install? see that: [Click me](https://github.com/YouMeb/youmeb.js/wiki/%E9%96%8B%E5%A7%8B%E4%BD%BF%E7%94%A8-YouMeb-!) 

## Events

* signup-success

## Installaction

### STEP1 - Install NPM Modules

    $ npm install --save youmeb-redis youmeb-rest-auth youmeb-sequelize youmeb-users mysql

### STEP2 - Configuration

#### Set on `/config/default.json` (You must have a YoumebJS project)

    {
      "packages": {
        //....
        "sequelize": {      // youmeb-sequelize setting
            "db": "your mysqlDB name",
            "username": "your User name",
            "password": "your password",
            "options": {
                "host": "your mysql url. ex:127.0.0.1"
            }
        },   
        "users": {         // youmeb-users setting
          "redis-database": 2,
          "token-expire": 604800,
          "nonce-expire": 300
        }
      }  
    }

### STEP3 - Migration
"Package" is our YoumebJS main architecture . On this youmeb-users project , we build a `user login` package which will help you to generate new table(users) and set all of `users's table` parameters in your MySQL database. 

First, you must build a new migration setting file, on cli:

    $ youmeb sequelize:generate:migration

Second, see `/migrations/` file , you can see a new `XXXXXXXX-users.js` file, and edit this migration file:
 
    var users = require('youmeb-users');

    module.exports = {
      up: users.createTable,
      down: users.dropTable
    };

Third, come back to your cli:

    $ youmeb sequelize:migrate

It will help you to build a new users table automatically. 

![](https://s3-us-west-2.amazonaws.com/iamblueblog/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7+2013-10-15+%E4%B8%8B%E5%8D%884.24.48.png)

### STEP4 - Define User model

First, in your cli:

    $ youmeb sequelize:generate:model

Generate a 'user' model,and edit it at `/models/user.js`:

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

### STEP5 - Setting app.js 

First, setting MySQL bigint:

app.js:

    var mysql = require('mysql');  //Don't forget to npm install mysql!

    (function () {
      var oldCreateConnection = mysql.createConnection;
      mysql.createConnection = function (config) {
        config.supportBigNumbers = true;
        config.bigNumberStrings = true;
        return oldCreateConnection.apply(this, arguments);
      };
    })();

Second, Setting Password hashing:

app.js

    module.exports = function () {

      this.invoke(function ($users) {
        $users.setPasswordHasher(function (pass, done) {
          done(null, sha1(pass));  // sha1 is your crypto algo function
        });
      });

    };

*Hint! Before you using this code , you must define a crypto algo function !* (Here is sha1 for a example)


## If you want to Customize your User Model,try that:

### Model

    var users = require('youmeb-users');

    module.exports = function (sequelize, DataTypes) {
      var schema = users.schema;
      schema.test = DataTypes.STRING;
      return sequelize.define('User', schema);
    };

### Migration

    var users = require('youmeb-users');

    module.exports = {
      up: function (migration, DataTypes, done) {
        var schema = users.schema;
        schema.test = DataTypes.STRING;
        users.createTable(sequelize, DataTypes, done);
      }
      // ...
    };
   
And don't forget to update your MySQL database(table).

## API

### Signup

* Method: POST
* Path: /api/user/signup
* Data:
    * Reauired: 
        * `password` - User Password
        * `login` - User Account Name
        * `email` - User Email Address
    * Optional:
        * `display` - User Display Name (Nickname or Real Name)
* Response:
    
    {
      "success": Boolean, // true or false
      "error": String,    // error code
      "data": {
        "user": {/* ... */}
      }
    }

### Get Nonce

* Method: GET
* Path: /api/rest-auth/nonce
* Response:

    {
      "success": Boolean,
      "data": {
        "nonce": String,
        "key": String
      }
    }

### Login

* Method: POST
* Path: /api/rest-auth/login
* Data:
    * Reauired:
        * `login` - User Account Name
        * `cnonce` - Client Nonce
        * `hash` - sha1([hash(password), cnonce, nonce].sort().join(''))
        * `key`
* Response:

    {
      "success": Boolean,
      "data": {
        "loginSuccess": Boolean,
        "token": String
      }
    }

## Frontend Example

(jQuery like:)

    $.get('/api/rest-auth/nonce', function (data) {
      if (!data.success) {
        return alert(data.error.code);
      }
      
      var password = sha1('123'); // you must define crypto algo function
      var hash = sha1([password, data.data.nonce, 'cnonce'].sort().join(''));
      
      $.post('/api/rest-auth/login', function (data) {
        if (!data.success) {
          return alert(data.error.code);
        }
        alert('Hello ' + data.data.user.display);
      });
    
    });

(Angular like:)

    $http.get('/api/rest-auth/nonce').success(function (data) {
        
        var password = hash('123'); // you must define crypto algo function
        var hash = sha1([password, data.data.nonce, 'cnonce'].sort().join(''));
        
        $http.post('/api/rest-auth/login', {
            login:'123',cnonce:'cnonce',hash:hash,key:data.data.key    
        }).success(function (data) {
            console.log(data);
        });
      });
      
    });

## License

(The MIT License)

Copyright (c) 2013 YouMeb and contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
