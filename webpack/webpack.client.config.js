const path = require('path');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base.config');

function resolvePath(relativePath) {
    return path.join(__dirname, '..', relativePath);
}

module.exports = merge(baseConfig, {
    entry: resolvePath('source/static/index.js'),

    plugins: [
        new HtmlPlugin({
            template: resolvePath('source/static/index.html')
        }),

        new CopyPlugin([{
            from: resolvePath('source/static/images/favicon.png')
        }])
    ]
});
