
var webpack = require('webpack'),
  path = require('path');
  
var ROOT = path.resolve(__dirname);
var APP = __dirname + '/';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var config = {
mode: "production",
devtool: 'source-map',
  context: APP,
  //./components/src/Presentation.js
  entry: { app: './app-client.js'},

  output: {
    path: path.join(ROOT, './public'),
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
  },
plugins: [
//new webpack.optimize.OccurenceOrderPlugin(),
new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 50000}),
new webpack.optimize.AggressiveMergingPlugin(),
//new webpack.optimize.DedupePlugin(),
new webpack.ProgressPlugin(),
new HtmlWebpackPlugin(),
new HtmlWebpackRootPlugin('container'),
new webpack.ProvidePlugin({ // inject ES5 modules as global vars
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery'
}),

  new webpack.DefinePlugin({
    'Reveal': './node_modules/reveal.js/js/reveal.js'
}),
new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css',
})
],
  resolve: {
    // the fewer directories, the faster module resolution is
    //modules: ['./node_modules'],
extensions: ['.js'],
    alias: {
 // Utilities: ['./components/','./components/src/','./components/lib/','./components/parts/']
 Utilities: path.resolve(__dirname, 'components/'),
    }
  },

  module: {
    rules: [
{
      test: /\.(js|jsx)$/,
      exclude: [/node_modules/,/assets/,/public/],
      loader: "babel-loader",
      include: __dirname
    },
      {
        test: /\.css$/,
        use: ['style-loader',
          'css-loader'
        ]
      },
      {
        test: /index\.html/,
        use: [{
          loader: 'file-loader?name=[name].[ext]'
        }
        ]
      },
{
        test: /reveal\.js\/plugin\/.*\.js$/, //[path]
        loader: 'file-loader?name=[name].[ext]'
      },
    
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url-loader?name=[name].[ext]'
      }

    ]
  },
 
  devServer: {
    contentBase: APP,
    historyApiFallback: true
  },
  optimization: {
    minimizer: [new TerserPlugin({}),new OptimizeCSSAssetsPlugin({})],
  },
};

module.exports = config;
