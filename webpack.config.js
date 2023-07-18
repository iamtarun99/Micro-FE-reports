const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require("path");
const deps = require('./package.json').dependencies;
module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3001,
    historyApiFallback: {
      index: '/index.html'
    },
    open: 'http://localhost:3001/ur/ui/reports/'
  },
  output: {
    publicPath: 'http://localhost:3001/ur/ui/reports/',
    uniqueName: 'reports',
  },
  resolve: {
    extensions: ["", '.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript'
          ],
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin(
      {
        name: 'reports',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App',
        },
        shared: [
          {
            ...deps,
            react: { eager: true, requiredVersion: deps.react, singleton: true },
            'react-dom': {
              eager: true,
              requiredVersion: deps['react-dom'],
              singleton: true,
            },
          },
        ],
      }
    ),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
  ],
  target: "web",
};