const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: "../.env",
});

module.exports = {
  entry: "./index.tsx",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js",
  },
  devServer: {
    port: process.env.CLIENT_PORT,
    proxy: {
      "/api": {
        target: `http://${process.env.SERVER_CONTAINER_NAME}:${process.env.SERVER_PORT}`,
        pathRewrite: { "^/api": "" },
      },
      "/socket.io": {
        target: `http://${process.env.SERVER_CONTAINER_NAME}:${process.env.SERVER_PORT}`,
        ws: true,
      },
    },
  },
  // // to make hot reloading work with docker
  // watchOptions: {
  //   aggregateTimeout: 200,
  //   poll: true,
  // },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.join(__dirname, "/public/index.html"),
    }),
  ],
};
