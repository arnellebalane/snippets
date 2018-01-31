const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(__dirname, '../views/index.html');
const template = fs.readFileSync(templatePath, 'utf-8');

const serverBundle = require('../public/vue-ssr-server-bundle.json');
const clientManifest = require('../public/vue-ssr-client-manifest.json');
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
    template,
    clientManifest,
    runInNewContext: false
});

module.exports = renderer;
