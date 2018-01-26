const server = require('server');
const { get, post, error } = server.router;
const { status, render, send, json } = server.reply;
const { Snippet } = require('./database/models');

server(
    get('/', ctx => render('index.html')),

    get('/:hash', ctx => {
        if (ctx.headers.accept === 'application/json') {
            return json({
                id: 1,
                hash: ctx.params.hash,
                body: 'console.log("hello world");'
            });
        }
        return render('index.html');
    }),

    get('/raw/:hash', ctx => {
        const snippet = {
            id: 1,
            hash: ctx.params.hash,
            body: 'console.log("hello world");'
        };
        return render('raw.html', { snippet });
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
