require('dotenv').config();

const { NODE_ENV = 'development', SNIPPETS_API_URL = 'http://localhost:3000' } = process.env;

export default {
  NODE_ENV,
  API_URL: SNIPPETS_API_URL
};
