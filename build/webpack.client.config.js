const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(baseConfig, {
    entry: {
        client: path.resolve(__dirname, '../source/entry-client.js')
    },
    plugins: [
        new UglifyJSPlugin(),
        new VueSSRClientPlugin(),
        new WorkboxPlugin({
            globDirectory: path.resolve(__dirname, '../public'),
            globPatterns: ['**/*.{css,js}'],
            swSrc: path.resolve(__dirname, '../source/sw.js'),
            swDest: path.resolve(__dirname, '../public/sw.js')
        })
    ]
});
