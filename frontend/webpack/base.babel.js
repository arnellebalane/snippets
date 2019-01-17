require('dotenv').config();
import path from 'path';
import {DefinePlugin} from 'webpack';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import config from '../config';

export function resolvePath(relativePath) {
    return path.join(__dirname, '..', relativePath);
}

export default {
    output: {
        path: resolvePath('build'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
    },

    mode: config.NODE_ENV === 'production'
        ? 'production'
        : 'development',

    devtool: config.NODE_ENV === 'production'
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
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(config.NODE_ENV),
                API_URL: JSON.stringify(config.API_URL)
            }
        }),

        new VueLoaderPlugin()
    ],

    resolve: {
        alias: {
            nodeModules: path.resolve(__dirname, '../../node_modules')
        }
    }
};
