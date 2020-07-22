var merge = require('webpack-merge').merge;
var common = require('./webpack.common');

module.exports = merge(common, {
    devServer: {
        contentBase: './docs',
        compress: true,
        port: 8080
    },
    devtool: 'inline-source-map'
});
