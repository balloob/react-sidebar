var path = require('path');

module.exports = {
  entry: {
    'example/compiled/index': './example/src/index',
    'example/compiled/responsive_example': './example/src/responsive_example',
  },

  output: {
    path: '.',
    filename: '[name].js',
    publicPath: '/example/compiled/',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },

  devServer: {
    contentBase: './example',
    host: 'localhost',
    inline: true,
    info: false,
  },
};
