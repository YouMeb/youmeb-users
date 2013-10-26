'use strict';

var uuid = require('node-uuid');

module.exports = function (DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
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
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  };
};
