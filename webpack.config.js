const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin }= require('webpack-manifest-plugin');  // produces a file called manifest.json

const config = {
    entry: './app/app.js',      // entry-  entry point to app
    output: {
        filename: 'myBundle.[hash].js',     // hash is for the cache busting name change
        path: path.resolve(__dirname,'docs')
    },
    plugins: [new HtmlWebpackPlugin({template: './app/index.html'})],           // will auto add css and js file to index.html
    mode: 'development',
    devtool: 'eval-cheap-source-map',       // preents browser warning msg: 'DevTools failed to load SourceMap'
     devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, 'docs'),
        hot: true
    },
    module: {
        rules: [
            {
                test:/\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [['@babel/preset-env',{'useBuiltIns':'usage', 'corejs': 3, 'targets': 'defaults'}],'@babel/preset-react']      // this setup will allow modern js to run in a wider variety of browsers
                    }
                }
            }
        ]
    }
    // mode: "development" // remove so can default to the appropriate server
}

if (currentTask == 'build'){        // i.e. npm run build
    config.mode = 'production';
    config.module.rules[0].use[0]=MiniCssExtractPlugin.loader;  // replace 'style-loader' with this loader in production
    config.plugins.push(new MiniCssExtractPlugin({filename: 'main.[hash].css'}), new CleanWebpackPlugin(), new WebpackManifestPlugin());   // cache buster
}
// 'build' will create a main.css file in dist/docs folder.
// 'dev' uses css bundled up with the js.

module.exports = config; 

// npx webpack-dev-server   // Should run but has error -> Error: Cannot find module 'webpack-cli/bin/config-yargs'   
// Looked this up and the command is apparently:
// webpack serv   <-- This works!!!

// 'style-loader' allows the packaged css to be used by the webpage (set to use in development)
     
