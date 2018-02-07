const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    devtool: '#inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"testing"'
            }
        })
    ],
    resolve: {
        alias: {
            source: path.resolve(__dirname, '../source')
        }
    }
});
