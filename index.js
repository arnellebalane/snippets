const server = require('server');
const { get, post, error } = server.router;
const { status, render, send, json } = server.reply;

server(
    get('/:hash?', ctx => render('index.html')),

    post('/snippets', ctx => {
        return json({
            id: 1,
            hash: 'abcde'
        });
    }),

    get('/snippets/:hash', ctx => {
        return json({
            id: 1,
            hash: ctx.params.hash
        });
    }),

    error(ctx => status(500).send(ctx.error.message))
).then(ctx => {
    ctx.log.info(`Server is now running at localhost:${ctx.options.port}`);
});
