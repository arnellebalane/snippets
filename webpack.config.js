const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'source/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [ {
            test: /\.vue$/,
            loader: 'vue-loader'
        } ]
    }
};
