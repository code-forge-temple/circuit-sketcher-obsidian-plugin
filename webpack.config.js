const path = require("path");
const webpack = require("webpack");
const fs = require('fs');

class UpdateAndCopyManifestPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tap('UpdateAndCopyManifestPlugin', (compilation) => {
            const packageJsonPath = path.resolve(__dirname, 'package.json');
            const manifestJsonPath = path.resolve(__dirname, 'manifest.json');
            const outputDir = path.resolve(__dirname, 'dist', 'circuit-sketcher');

            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const version = packageJson.version;

            const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));
            manifestJson.version = version;

            fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 4), 'utf8');

            console.log('Updated manifest.json with version:', version);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const outputManifestPath = path.join(outputDir, 'manifest.json');
            fs.copyFileSync(manifestJsonPath, outputManifestPath);

            console.log('Copied manifest.json to:', outputManifestPath);
        });
    }
}

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
        new UpdateAndCopyManifestPlugin(),
    ],
};
