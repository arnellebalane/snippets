const path = require('path');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/build/'
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
