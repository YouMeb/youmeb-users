youmeb-users
============

## Dependencies

## Installaction

app.js

    module.exports = function () {

      this.invoke(function ($users) {

        $users.setPasswordHasher(function (pass, done) {
          done(sha1(pass));
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
