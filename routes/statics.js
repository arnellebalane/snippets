const fs = require('fs');
const path = require('path');
const util = require('util');
const { get } = require('server/router');
const { header, send } = require('server/reply');

const readFile = util.promisify(fs.readFile);

async function workbox(ctx) {
    const workboxSwPath = path.resolve(__dirname, '../node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.2.js');
    const file = await readFile(workboxSwPath, 'utf-8');
    return header({
        'Content-Type': 'application/javascript'
    }).send(file);
}

module.exports = [
    get('/statics/workbox-sw.js', workbox)
];
