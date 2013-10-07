youmeb-users
============

## Dependencies

* youmeb-redis
* youmeb-rest-auth

## Installaction

    $ npm install --save youmeb-redis youmeb-rest-auth

app.js

    module.exports = function () {

      this.invoke(function ($users) {

        $users.setPasswordHasher(function (pass, done) {
          done(null, sha1(pass));
        });

      });

    };

## Configuration

    {
      "packages": {
        "users": {
          "redis-database": 2
        }
      }  
    }
