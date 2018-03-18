const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    entry: {
        server: path.resolve(__dirname, '../source/entry-server.js')
    },
    output: {
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    externals: [nodeExternals()],
    plugins: [
        new VueSSRServerPlugin()
    ]
});
