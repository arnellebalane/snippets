const server = require('server');
const { get, post, error } = server.router;
const routes = require('auto-load')('routes');

server(
    get('/', routes.home),
    get('/:hash', routes.snippets.get),
    get('/raw/:hash', routes.snippets.raw),
    post('/snippets', routes.snippets.create),

    routes.statics,

    error(ctx => {
        throw ctx.error;
    })
).then(ctx => {
    ctx.log.info(`Server is now running at localhost:${ctx.options.port}`);
});
