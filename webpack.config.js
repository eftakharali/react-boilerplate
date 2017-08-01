const HtmlWebpackPlugin = require('html-webpack-plugin'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      webpack = require('webpack'),
      bootstrapEntryPoints = require('./webpack.bootstrap.config')
      path = require('path');

const isProd = process.env.NODE_ENV ==='production';
const cssDev = ['style-loader', 'css-loader','sass-loader'];
const cssProd = ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use:['css-loader','sass-loader'],
            publicPath: path.resolve(__dirname, 'public')
          });
const cssConfig = isProd ? cssProd : cssDev;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry : {
    bootstrap : bootstrapConfig,
    app: './src/app.js'
  },
  output :{
    path: path.resolve(__dirname, 'public'),
    filename : '[name].bundle.js'
  },
  devServer : {
    host:'localhost',
    contentBase: path.resolve(__dirname,'public'),
    compress: true,
    port: 9000,
    stats:'errors-only',
    open:true,
    hot:true,
    openPage:''
  },
  module : {
    rules : [
      {
        test:/\.scss$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use:cssConfig
      },
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader" 
      },
      {
        test:/\.(jpe?g|png|gif|svg)$/,
        use: [
          'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/', // use: 'file-loader?name=[hash:12].[ext]&outputPath=images/' // 'file-loader?name=images/[name].[ext]'
          'images-webpack-loader'
        ]
      },
      { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name]' },
      { test: /\.(ttf|eot)$/, loader: 'file-loader' },
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports-loader?jQuery=jquery' }
    ]
  },
  plugins : [
    new HtmlWebpackPlugin({
      title: 'React Project',
      // minify: {
      //   collapseWhitespace: true
      // },
      hash: true,
      template : './src/index.html'
    }),
    new ExtractTextPlugin({
      filename: '/css/[name].css',
      disable: !isProd,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}