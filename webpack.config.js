const path = require('path');

module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-3'],
        //  plugins: ['transform-runtime']
      },
    }],
  },
};
