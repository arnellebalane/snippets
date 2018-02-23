const {send} = require('server/reply');
const renderer = require('./_renderer');

async function home(ctx) {
    const response = await renderer.renderToString({url: ctx.url});
    return send(response);
}

module.exports = home;
