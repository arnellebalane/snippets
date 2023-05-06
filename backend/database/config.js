const config = require('../config');

module.exports = {
  development: {
    dialect: 'postgres',
    url: config.DATABASE_URL,
  },
  test: {
    dialect: 'postgres',
    url: config.DATABASE_URL,
  },
  production: {
    dialect: 'postgres',
    url: config.DATABASE_URL,
  },
};
