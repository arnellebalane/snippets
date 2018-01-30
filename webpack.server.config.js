const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    entry: {
        server: path.resolve(__dirname, 'public/source/entry-server.js')
    },
    output: {
        libraryTarget: 'commonjs2'
    },
    target: 'node'
});
