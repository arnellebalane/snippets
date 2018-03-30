const server = require('server');
const {get, post, error} = require('server/router');
const {json, status} = require('server/reply');
const {Snippet} = require('./database/models');

server(
    get('/:hash', async ctx => {
        const hash = ctx.params.hash;
        const snippet = await Snippet.findOne({where: {hash}});

        return snippet
            ? json(snippet.get())
            : status(404).json({message: 'Snippet not found.'});
    }),

    get('/raw/:hash', async ctx => {
        const hash = ctx.params.hash;
        const snippet = await Snippet.findOne({where: {hash}});

        return snippet
            ? json(snippet.get())
            : status(404).json({message: 'Snippet not found.'});
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
