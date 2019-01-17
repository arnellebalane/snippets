import merge from 'webpack-merge';
import HtmlPlugin from 'html-webpack-plugin';
import baseConfig, {resolvePath} from './base.babel';

module.exports = merge(baseConfig, {
    entry: resolvePath('source/static/index.js'),

    plugins: [
        new HtmlPlugin({
            template: resolvePath('source/static/index.html'),
            favicon: resolvePath('source/static/images/favicon.png')
        })
    ]
});
