const server = require('server');
const { get, post, error } = server.router;
const { status, render, send, json } = server.reply;

server(
    get('/', ctx => render('index.html')),

    get('/:hash', ctx => {
        if (ctx.headers.accept === 'application/json') {
            return json({
                id: 1,
                hash: ctx.params.hash
            });
        }
        return render('index.html');
    }),

    post('/snippets', ctx => {
        return json({
            id: 1,
            hash: 'abcde'
        });
    }),

    error(ctx => status(500).send(ctx.error.message))
).then(ctx => {
    ctx.log.info(`Server is now running at localhost:${ctx.options.port}`);
});
