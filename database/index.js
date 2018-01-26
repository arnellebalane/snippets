const Sequelize = require('sequelize');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const connectionConfig = config[env].url;
const db = new Sequelize(connectionConfig, {
    logging: false
});

module.exports = db;
