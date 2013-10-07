'use strict';

var callbackWrapper = require('callback-wrapper');

module.exports = function (config, done) {
  return function ($youmeb, $redis, $redisClient) {

    ($youmeb.isCli ? cliInit : init)(config, done);

    function cliInit(config, done) {
      done();
    };

    function init(config, done) {
      initAndGetRedisClient(callbackWrapper(done, function (err, client) {
        initRestAuth(client, done);
      }));
    }

    function initAndGetRedisClient(done) {
      var redisDatabaseIndex = getRedisDatabaseIndex();
      getRedisClient(callbackWrapper(done, function (err, client) {
        client.select(redisDatabaseIndex, callbackWrapper(done, function () {
          done(null, client);
        }));
      }));
    }

    function getRedisDatabaseIndex() {
      return config.get('redis-database') || 0;
    }

    function getRedisClient(done) {
      $redisClient(done);
    }

    function selectRedisDatabase(done) {
      client.select(database, done);
    }

    function initRestAuth(config, done) {
      $youmeb.invoke(require('./restauth')(config, done));
    }

  };
};
