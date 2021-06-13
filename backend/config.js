require('dotenv').config();

const { DATABASE_URL, SNIPPETS_CLIENT_URL = 'http://localhost:5000' } = process.env;

module.exports = {
  DATABASE_URL,
  CLIENT_URL: SNIPPETS_CLIENT_URL
};
