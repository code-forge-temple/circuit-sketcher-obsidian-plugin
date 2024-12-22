const path = require("path");
const webpack = require("webpack");

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [
        require("postcss-url")({
          url: "inline",
          maxSize: Infinity,
        }),
      ],
    },
  },
};

module.exports = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", postcssLoader],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader", postcssLoader],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: "raw-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist/circuit-sketcher"),
    libraryTarget: "commonjs",
  },
  target: "node",
  //devtool: "inline-source-map",
  externals: {
    obsidian: "commonjs obsidian",
  },
  mode: "production",
  plugins: [
    new webpack.BannerPlugin({
      banner: `/*! Also see LICENSE file in the root of the project. */`,
      raw: true,
    }),
  ],
};
