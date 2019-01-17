const server = require('server');
const cors = require('cors');
const {get, post, error} = require('server/router');
const {json, render, status, header} = require('server/reply');
const {Snippet} = require('./database/models');
const config = require('./config');

server(
    server.utils.modern(cors({
        origin: [config.CLIENT_URL]
    })),

    get('/:hash', async ctx => {
        const hash = ctx.params.hash;
        const snippet = await Snippet.findOne({where: {hash}});

        return snippet
            ? json(snippet.get())
            : status(404).json({code: 404, message: 'Snippet not found.'});
    }),

    get('/raw/:hash', async ctx => {
        const hash = ctx.params.hash;
        const snippet = await Snippet.findOne({where: {hash}});

        return snippet
            ? render('raw.html', {snippet: snippet.get()})
            : status(404).json({code: 404, message: 'Snippet not found.'});
    }),

    post('/snippets', async ctx => {
        const snippet = await Snippet.create({body: ctx.data.snippet});
        return json(snippet.get());
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
