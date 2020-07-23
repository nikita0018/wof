var merge = require('webpack-merge').merge;
var common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production'
});
