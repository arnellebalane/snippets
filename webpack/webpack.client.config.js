const path = require('path');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    entry: path.resolve(__dirname, '../source/static/index.js'),
    plugins: [
        new CopyPlugin([{
            from: path.resolve(__dirname, '../source/static/images/favicon.png')
        }]),
        new UglifyJSPlugin(),
        new WorkboxPlugin.InjectManifest({
            swSrc: path.resolve(__dirname, '../source/static/sw.js'),
            swDest: 'sw.js'
        })
    ]
});
