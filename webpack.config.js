const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs").promises;

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

const ENVIRONMENT = "production";

module.exports = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
          },
          {
            loader: "webpack-preprocessor-loader",
            options: {
              params: {
                dev: ENVIRONMENT === "development", // for preprocessor commands defined with `#!if dev` and `#!endif` (multiple lines)
              },
              directives: {
                dev: ENVIRONMENT === "development", // for preprocessor command `#!dev` (single line)
              },
            },
          },
        ],
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
  mode: ENVIRONMENT,
  plugins: [
    new webpack.BannerPlugin({
      banner: `/*! Also see LICENSE file in the root of the project. */`,
      raw: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
          {
              from: path.resolve("./manifest.json"),
              to: "manifest.json",
              transform: async (content) => {
                  try {
                      const pkgPath = path.resolve("package.json");
                      const pkgData = await fs.readFile(pkgPath, "utf8");
                      const pkg = JSON.parse(pkgData);
                      const manifest = JSON.parse(content.toString());

                      manifest.version = pkg.version;

                      return JSON.stringify(manifest, null, 4);
                  } catch (error) {
                      console.error("Error updating manifest.json:", error);

                      return content;
                  }
              },
          },
      ],
  }),
  ],
};
