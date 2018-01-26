const server = require('server');
const { get, post, error } = server.router;
const { status, render, send, json } = server.reply;
const { Snippet } = require('./database/models');

server(
    get('/', ctx => render('index.html')),

    get('/:hash', async ctx => {
        if (ctx.headers.accept === 'application/json') {
            const hash = ctx.params.hash;
            const snippet = await Snippet.findOne({ where: { hash } });
            return json(snippet.get());
        }
        return render('index.html');
    }),

    get('/raw/:hash', async ctx => {
        const hash = ctx.params.hash;
        const snippet = await Snippet.findOne({ where: { hash } });
        return render('raw.html', { snippet: snippet.get() });
    }),

    post('/snippets', async ctx => {
        const snippet = await Snippet.create({ body: ctx.data.snippet });
        return json(snippet.get());
    }),

    error(ctx => {
        throw ctx.error;
    })
).then(ctx => {
    ctx.log.info(`Server is now running at localhost:${ctx.options.port}`);
});