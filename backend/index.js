const server = require('server');
const cors = require('cors');
const { get, post, error } = require('server/router');
const { json, status } = require('server/reply');
const { Snippet } = require('./database/models');
const config = require('./config');

const options = {
  security: {
    csrf: false
  }
};

server(
  options,

  server.utils.modern(
    cors({
      origin: [config.CLIENT_URL]
    })
  ),

  get('/', () => json({ version: '1.0.0', name: 'snippets-backend' })),

  get('/:hash', async ctx => {
    try {
      const hash = ctx.params.hash;
      const snippet = await Snippet.findOne({ where: { hash } });

      return snippet ? json(snippet.get()) : status(404).json({ code: 404, message: 'Snippet not found' });
    } catch (error) {
      console.error(error);
      return status(500).json({ code: 500, message: 'Internal server error' });
    }
  }),

  post('/snippets', async ctx => {
    try {
      const snippet = await Snippet.create({ body: ctx.data.snippet });
      return json(snippet.get());
    } catch (error) {
      console.error(error);
      return status(500).json({ code: 500, message: 'Internal server error' });
    }
  }),

  error(ctx => {
    throw ctx.error;
  })
).then(ctx => {
  ctx.log.info(`Server is now running at localhost:${ctx.options.port}`);
});

// Graceful shutdown
const signals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGTERM: 15
};

const shutdown = (signal, value) => {
  throw new Error(`Server stopped by ${signal} with value ${value}`);
};

Object.keys(signals).forEach(signal => {
  process.on(signal, () => shutdown(signal, signals[signal]));
});
