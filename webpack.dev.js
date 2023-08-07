const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('path');

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'public'),
                watch: false,
            },
            {
                directory: path.join(__dirname),
                watch: false,
            }
        ],
        hot: true,
        proxy: {
            '/api': {...localProxy},
            '/sage': {...localProxy},
            '/node_modules/': {...localProxy},
            '/version': {...localProxy},
        },
        watchFiles: 'src/**/*',
    },
    devtool: 'eval-source-map',
    plugins: []
});
