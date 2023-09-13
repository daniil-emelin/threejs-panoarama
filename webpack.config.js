const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/script.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        include: /src/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        exclude: /node_modules/,
        sideEffects: true,
      },
      {
        test: /\.(jpe?g|png)$/i,
        loader: "file-loader",
        options: {
          name: "/assets/[name].[ext]",
        },
      },
      {
        test: /three\/examples\/js/,
        use: "imports-loader?THREE=three",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["dist"],
        },
      },
    }),
  ],
  devServer: {
    watchFiles: path.join(__dirname, "src"),
    port: 3000,
  },
  resolve: {
    alias: {
      three: path.resolve("node_modules", "three/build/three.module.js"),
    },
  },
};
