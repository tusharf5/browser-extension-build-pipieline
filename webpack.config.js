const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackZipPlugin = require('webpack-zip-plugin');

const allBrowsers = ['safari', 'mozilla', 'chrome'];

const cleanOptions = {
  root: path.resolve(__dirname),
  verbose: true,
  dry: false
};

module.exports = env => {
  if (!env || !env.browser) {
    throw new Error('Pass a browser Type');
  }

  const pathsToClean =
    env.browser === 'safari' ? ['dist.safariextension'] : ['dist'];

  const commonPlugins = [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      BROWSER: JSON.stringify(env.browser)
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new CopyWebpackPlugin(
      [{ from: `static` }, { from: `src/${env.browser}/assets/static` }],
      { copyUnmodified: true }
    ),
    new HtmlWebpackPlugin({
      title: 'Content',
      template: `src/common/content.html`,
      filename: 'content.html',
      chunks: ['content']
    }),
    new HtmlWebpackPlugin({
      title: 'Events',
      template: `src/${env.browser}/events/event.html`,
      filename: 'event.html',
      chunks: ['event']
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        mangle: false
      }
    })
  ];

  let pluginsToUse = commonPlugins;

  if (env.browser === 'chrome') {
    pluginsToUse = commonPlugins.concat(
      new WebpackZipPlugin({
        frontShell: 'ls && pwd',
        initialFile: 'dist',
        endPath: './',
        zipName: `${env.browser}.zip`,
        behindShell: ''
      })
    );
  }

  return {
    context: path.resolve(__dirname),
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    entry: {
      //popup: `./src/${env.browser}/popup/popup.ts`,
      content: `./src/${env.browser}/content/content.ts`,
      event: `./src/${env.browser}/events/event.ts`
    },
    output: {
      path:
        env.browser === 'safari'
          ? path.resolve(__dirname, 'dist.safariextension')
          : path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.json'
          }
        },
        {
          test: /\.(sass|scss)$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: { importLoaders: 1 }
              },
              {
                loader: 'sass-loader'
              }
            ]
          })
        }
      ]
    },
    externals: [
      function excludeDir(context, request, callback) {
        let browsersList = allBrowsers
          .filter(val => val !== env.browser)
          .join('|');
        let browserRegex = new RegExp(`^[^\/]+\/native\/(${browsersList})`);
        if (browserRegex.test(request)) {
          return callback(null, 'undefined');
        }
        return callback();
      }
    ],
    plugins: pluginsToUse
  };
};
