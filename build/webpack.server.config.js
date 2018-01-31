const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = merge(baseConfig, {
    entry: {
        server: path.resolve(__dirname, '../source/entry-server.js')
    },
    output: {
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    plugins: [
        new VueSSRServerPlugin()
    ]
});
