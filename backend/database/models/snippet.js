'use strict';

const crypto = require('crypto');
const { Model } = require('sequelize');

function generateHash(data) {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('ascii')
    .replace(/[^\w\d]/g, '')
    .substring(0, 5);
}

module.exports = (sequelize, DataTypes) => {
  class Snippet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Snippet.init(
    {
      hash: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Snippet',

      hooks: {
        async beforeValidate(instance) {
          let body = instance.body + Date.now();
          let hash = generateHash(body);
          let existing = await Snippet.findOne({ where: { hash } });

          while (existing) {
            body = instance.body + Date.now();
            hash = generateHash(body);
            existing = await Snippet.findOne({ where: { hash } });
          }

          instance.hash = hash;
        }
      }
    }
  );

  return Snippet;
};
