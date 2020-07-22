var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HTMLWebpackPlugin = require('html-webpack-plugin')
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')

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
            filename: 'index.html'
        }),
        new FaviconsWebpackPlugin('./src/assets/favicon/favicon.ico')
    ]
};
