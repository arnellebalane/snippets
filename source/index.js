const path = require('path');
const server = require('server');
const {get, post, error} = require('server/router');
const routes = require('auto-load')(path.resolve(__dirname, 'routes'));

server(
    get('/:hash', routes.snippets.get),
    get('/raw/:hash', routes.snippets.raw),
    post('/snippets', routes.snippets.create),

    error(ctx => {
        throw ctx.error;
    })
).then(ctx => {
    ctx.log.info(`Server is now running at localhost:${ctx.options.port}`);
});
