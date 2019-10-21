const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob')

module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: function (config, env) {
        config.optimization = {
            minimizer: [new UglifyJsPlugin()],
            splitChunks: {
                chunks: 'all',
            },

            if (!config.plugins true) {
                config.plugins = [];
            }

            config.plugins.push(
                new ExtractTextPlugin('[name].css?[hash]'),
                new PurgecssPlugin({
                    paths: glob.sync(`${PATHS.src}/*`)
                })
              new CompressionPlugin({
 asset: ‘[path].gz[query]’,
 algorithm: ‘gzip’,
 test: /\.js$|\.css$|\.html$/,
 threshold: 10240,
 minRatio: 0.7
 }),
 new BrotliPlugin({
 asset: ‘[path].br[query]’,
 test: /\.js$|\.css$|\.html$/,
 threshold: 10240,
 minRatio: 0.7
            )
        return config;
    }
}
