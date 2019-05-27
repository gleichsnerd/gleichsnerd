const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/gleichsnerd.js',
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};