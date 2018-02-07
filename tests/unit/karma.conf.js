const webpackConfig = require('../../build/webpack.test.config');

module.exports = config => {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: ['mocha'],
        reporters: ['spec'],
        files: ['./index.js'],
        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};
