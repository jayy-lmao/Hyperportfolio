// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = ({
  mode,
} = {
  mode: 'production',
}) => {
  console.log(`mode is: ${mode}`);

  return {
    // optimization: {
    //     // minimizer: [new UglifyJsPlugin()],
    //     // splitChunks: { chunks: 'all' },
    // },
    mode,
    entry: './src/index.js',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'build'),
      filename: 'bundled.js',
    },
    module: {
      rules: [{
        test: /\.jpe?g|png$/,
        exclude: /node_modules/,
        loader: ['url-loader', 'file-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.es6'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      //     new MomentLocalesPlugin({
      //         localesToKeep: ['es-us'],
      // }),
    ],
  };
};
