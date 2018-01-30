const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(baseConfig, {
    entry: {
        client: path.resolve(__dirname, 'public/source/entry-client.js')
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(`${process.env.NODE_ENV || 'development'}`)
            }
        }),
        new UglifyJsPlugin({
            sourceMap: true
        })
    ]
});
