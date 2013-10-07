youmeb-users
============

## Dependencies

* youmeb-redis
* youmeb-rest-auth
* youmeb-sequelize

## Installaction

    $ npm install --save youmeb-redis youmeb-rest-auth youmeb-sequelize youmeb-users

### Support bigint (MySQL)

app.js

    (function () {
      var oldCreateConnection = mysql.createConnection;
      mysql.createConnection = function (config) {
        config.supportBigNumbers = true;
        config.bigNumberStrings = true;
        return oldCreateConnection.apply(this, arguments);
      };
    })();

### Password hashing

app.js

    module.exports = function () {

      this.invoke(function ($users) {

        $users.setPasswordHasher(function (pass, done) {
          done(null, sha1(pass));
        });

      });

    };

### Define User model

    $ youmeb sequelize:generate:model


    var users = require('youmeb-users');
    
    module.exports = function (sequelize, DataTypes) {
      return sequelize.define('User', users.schema);
    };

## Configuration

    {
      "packages": {
        "users": {
          "redis-database": 2
        }
      }  
    }

## Migration

    $ youmeb sequelize:generate:migration

Edit migration file

    var users = require('youmeb-users');

    module.exports = {
      up: users.createTable,
      down: users.dropTable
    };

## Customize User Model

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
      up: function (sequelize, DataTypes, done) {
        var schema = users.schema;
        schema.test = DataTypes.STRING;
        users.createTable(sequelize, DataTypes, done);
      }
      // ...
    };
