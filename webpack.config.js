const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATH = {
  entry: path.join(__dirname, 'src/js/index.js'),
  output: path.join(__dirname, 'dist'),
  template: path.join(__dirname, 'src/index.html')
}

const isProd = process.env.NODE_ENV === 'production'; // true or false;

const htmlWebpackPluginConfig = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: PATH.template,
  hash: true,
  minify: {
    collapseWhitespace: isProd
  }
});

const extractTextPluginConfig = new ExtractTextPlugin({
  filename: 'main.css',
  allChunks: true,
  disable: false
});

const cleanWebpackPluginConfig = new CleanWebpackPlugin(['dist']);
const openBrowserPluginConfig = new OpenBrowserPlugin({url: 'http://localhost:3000'});
const hotModuleReplacementPluginConfig = new webpack.HotModuleReplacementPlugin();

const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'sass-loader'],
  publicPath: '/'
});
const cssConfig = isProd ? cssProd : cssDev;

const getPlugins = () => {
  const plugins = [
    htmlWebpackPluginConfig
  ];

  if(isProd) {
    plugins.push(cleanWebpackPluginConfig, extractTextPluginConfig);
  }else {
    plugins.push(openBrowserPluginConfig, hotModuleReplacementPluginConfig);
  }

  return plugins;
};

module.exports = {
  entry: ['react-hot-loader/patch', PATH.entry, 'webpack-hot-middleware/client'],
  output: {
    filename: '[name].bundle.js',
    path: PATH.output,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: cssConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: ["react-hot-loader/babel"],
              presets: [['env', {"modules": false}], 'react']
            }
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
// OnlyApply for webpack-dev-server
// devServer: {
//   contentBase: path.join(__dirname, "dist"),
//   compress: true,
//   port: 9000,
//   open: true,
//   stats: "errors-only",
//   hot: true
// },
  plugins: getPlugins()
}
