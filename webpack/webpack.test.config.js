const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['env', {modules: false}]
                ]
            }
        }]
    },
    devtool: 'inline-cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"testing"'
            }
        })
    ],
    externals: [nodeExternals()],
    resolve: {
        alias: {
            source: path.resolve(__dirname, '../source/static')
        }
    }
});