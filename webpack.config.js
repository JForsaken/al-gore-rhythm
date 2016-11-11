const path = require('path');

module.exports = {
  entry: {
    js: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  target: 'node',
  node: {
    console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-3'],
        },
      },
      { test: /\.csv$/, loader: 'csv-loader' },
      { test: /\.json$/, loader: 'json' },
    ],
  },
};
