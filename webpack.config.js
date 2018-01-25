const path = require('path');

module.exports = {
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, 'public/source/index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename: '[name].js'
    },
    module: {
        rules: [ {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        } ]
    }
};
