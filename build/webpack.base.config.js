const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [ {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                extractCSS: true
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [ {
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                } ]
            })
        } ]
    },
    plugins: [
        new ExtractTextPlugin('index.css')
    ]
};
