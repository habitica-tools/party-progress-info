const path = require('path');
const isProd = (process.env.NODE_ENV === 'production');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    
    //input
    entry: './src',

    //output
    output: {
        path : path.join(__dirname, 'build'),
        filename : 'bundle.js'
    },

    //transformations
    module: {
        rules : [
            {
                test: /\.jsx?/i,
                loader: 'babel-loader'
            }
        ]
    },
       
    //sourcemaps
    devtool: 'source-map',
    
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    })],

    //server
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        compress: true,
        historyApiFallback: true
    }
}