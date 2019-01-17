import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import baseConfig, {resolvePath} from './base.babel';

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

    externals: [nodeExternals()],

    resolve: {
        alias: {
            source: resolvePath('source/static')
        }
    }
});
