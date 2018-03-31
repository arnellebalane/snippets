require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

module.exports = {
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
    },
    mode: process.env.NODE_ENV || 'development',
    devtool: process.env.NODE_ENV === 'production'
        ? 'source-map'
        : 'cheap-module-eval-source-map',
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                BASE_URL: JSON.stringify(process.env.BASE_URL || 'http://localhost:3000/')
            }
        })
    ],
    resolve: {
        alias: {
            nodeModules: path.resolve(__dirname, '../node_modules')
        }
    }
};
