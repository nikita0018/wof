var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin;
var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    target: 'web',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'docs')
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: './src/assets',
                to: 'assets'
            }]
        }),
        new HTMLWebpackPlugin({
            template: './src/index.html',
            favicon: './src/assets/favicon.ico',
            filename: 'index.html'
        }),
        new SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader']
        }]
    }
};
