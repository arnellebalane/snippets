const fs = require('fs');
const path = require('path');
const { send } = require('server/reply');

const templatePath = path.resolve(__dirname, '../views/index.html');
const template = fs.readFileSync(templatePath, 'utf-8');

const serverBundle = require('../public/vue-ssr-server-bundle.json');
const clientManifest = require('../public/vue-ssr-client-manifest.json');
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
    template,
    clientManifest,
    runInNewContext: false
});

async function home(ctx) {
    const response = await renderer.renderToString({ url: ctx.url });
    return send(response);
}

module.exports = home;
