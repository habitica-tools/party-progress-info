const path = require('node:path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    // input
    entry: ['./src'],

    // output
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    // transformations
    module: {
        rules: [
            {
                test: /\.jsx?/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },

    // resolves
    resolve: {
        alias: {
            'react': 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat', // Must be below test-utils
            'react/jsx-runtime': 'preact/jsx-runtime',
        },
    },

    // plugins
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.ico',
        }),
        new Dotenv({
            path: './.env',
            systemvars: true,
        }),
    ],

    performance: {
        maxAssetSize: 350 * 1024,
        maxEntrypointSize: 350 * 1024,
    },

    // server
    devServer: {
        static: path.join(__dirname, 'src'),
        compress: true,
        historyApiFallback: true,
    },
}

module.exports = (_, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    return config;
}
