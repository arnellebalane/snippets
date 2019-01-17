import merge from 'webpack-merge';
import HtmlPlugin from 'html-webpack-plugin';
import baseConfig, {resolvePath} from './base.babel';

module.exports = merge(baseConfig, {
    entry: resolvePath('source/index.js'),

    plugins: [
        new HtmlPlugin({
            template: resolvePath('source/index.html'),
            favicon: resolvePath('source/images/favicon.png')
        })
    ]
});
