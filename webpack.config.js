const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
    entry: "./src/js/main.js",
    devtool: "cheap-eval-source-map",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader', },
                    { loader: 'css-loader' }
                ]
            },
        ]
    },
    plugins: [
        new htmlWebpackPlugin({ template: './index.html' })
    ],
    watch: true
}