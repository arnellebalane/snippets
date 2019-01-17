require('dotenv').config();

const {
    DATABASE_URL,
    CLIENT_URL = 'http://localhost:5000'
} = process.env;

module.exports = {
    DATABASE_URL,
    CLIENT_URL
};
