const server = require('server');
const { get, error } = server.router;
const { status, render, send } = server.reply;

server(
    get('/:hash?', ctx => render('index.html')),

    error(ctx => status(500).send(ctx.error.message))
).then(ctx => {
    ctx.log.info(`Server is now running at localhost:${ctx.options.port}`);
});
