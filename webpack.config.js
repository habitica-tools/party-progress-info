const path = require('path');
const isProd = (process.env.NODE_ENV === 'production');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    //input
    entry: ['./src'],

    //output
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },

    //transformations
    module: {
        rules: [
            {
                test: /\.jsx?/i,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },

    //resolves
    resolve: {
        alias: {
            "react": "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat",     // Must be below test-utils
            "react/jsx-runtime": "preact/jsx-runtime"
        },
    },

    //sourcemaps
    devtool: 'source-map',

    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: "./src/favicon.ico"
    })],

    //server
    devServer: {
        static: path.join(__dirname, 'src'),
        compress: true,
        historyApiFallback: true
    }
}