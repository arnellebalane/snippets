const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(baseConfig, {
    entry: {
        client: path.resolve(__dirname, 'source/entry-client.js')
    },
    plugins: [
        new VueSSRClientPlugin()
    ]
});
