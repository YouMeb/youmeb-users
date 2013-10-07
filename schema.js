'use strict';

var bignum = require('bignum');

module.exports = function (DataTypes) {
  return {
    id: {
      type: DataTypes.DECIMAL(29, 0),
      allowNull: false,
      primaryKey: true,
      get: function () {
        if (this.__bignumId === this.dataValues.id) {
          return this.__bignumIdCache;
        }
        this.__bignumId = this.dataValues.id;
        this.__bignumIdCache = bignum(this.dataValues.id).toString(16);
        return this.__bignumIdCache;
      }
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    display: {
      type: DataTypes.STRING,
      allowNull: true
    },
    groups: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      set: function (arr) {
        return (arr instanceof Array ? arr : [arr]).join(',');
      },
      get: function () {
        var data = (this.selectedValues.groups || '').split(',');

        if (data[0] === '') {
          data.shift();
        }

        return data;
      }
    }
  };
};
