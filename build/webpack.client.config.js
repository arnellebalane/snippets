const path = require('path');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    entry: {
        client: path.resolve(__dirname, '../source/entry-client.js')
    },
    plugins: [
        new CopyPlugin([{
            from: path.resolve(__dirname, '../source/images/favicon.png')
        }]),
        new UglifyJSPlugin(),
        new VueSSRClientPlugin(),
        new WorkboxPlugin.InjectManifest({
            swSrc: path.resolve(__dirname, '../source/sw.js'),
            swDest: 'sw.js'
        })
    ]
});
