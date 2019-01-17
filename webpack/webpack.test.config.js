const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config');

function resolvePath(relativePath) {
    return path.join(__dirname, '..', relativePath);
}

module.exports = merge(baseConfig, {
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['@babel/preset-env', {modules: false}]
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
            source: resolvePath('source/static')
        }
    }
});
