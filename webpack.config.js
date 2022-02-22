const path = require("path");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {DefinePlugin} = require("webpack");
const pkg = require("./package.json");

module.exports = args => {
    const {mode = "renderer", minify = false} = args;
    
    /**@type {import("webpack").Configuration} */
    const config = {
        devtool: !!minify ? false : "eval-source-map",
        mode: !!minify ? "production" : "development",
        entry: `./src/${mode}/index`,
        output: {
            path: path.resolve(__dirname, "dist"),
            library: {
                type: mode === "renderer" ? "module" : "commonjs"
            },
            filename: `${mode}.js`,
        },
        experiments: {
            outputModule: true
        },
        node: {
            __dirname: false
        },
        externals: {
            // Automatically add all dependencies as externals.
            ...Object.fromEntries(
                Object.keys(pkg.dependencies).map(e => [e, e])
            ),
            inspector: "inspector",
            path: "path",
            fs: "fs",
            module: "module",
            electron: "electron",
        },
        module: {
            rules: [
                {
                    test: /\.(m|c)?(j|t)sx?$/i,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "swc-loader",
                        options: {
                            sourceMaps: true,
                            minify: !!minify,
                            jsc: {
                                parser: {
                                    tsx: true,
                                    syntax: "typescript",
                                    decorators: true
                                },
                                target: "es2022"
                            },
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: true,
                                // modules: { // Disable this if you don't want the css classNames to be transformed.
                                //     localIdentName: "holy-[name]-[local]"
                                // }
                            }
                        },
                        "sass-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [
                ".jsx",
                ".js",
                ".mjs",
                ".cjs",
                ".svg",
                ".ts",
                ".tsx",
                ".scss",
                ".css",
            ],
            alias: {
                "@powercord":   path.resolve(__dirname, "./src/renderer/powercord"),
                "@data":        path.resolve(__dirname, "./src/renderer/data"),
                "@modules":     path.resolve(__dirname, "./src/renderer/modules"),
                "@ui":          path.resolve(__dirname, "./src/renderer/ui"),
                "@node":        path.resolve(__dirname, "./src/renderer/node"),
                "@common":      path.resolve(__dirname, "./src/common"),
                "@classes":     path.resolve(__dirname, "./src/renderer/classes"),
                "@flux":        path.resolve(__dirname, "./src/renderer/flux"),
                "@decorators":  path.resolve(__dirname, "./src/renderer/decorators")
            }
        },
        plugins: [
            // new CircularDependencyPlugin(),
            new MiniCssExtractPlugin({
                filename: "style.css"
            }),
            new DefinePlugin({
                "__NODE_ENV__": JSON.stringify(minify ? "PRODUCTION" : "DEVELOPMENT")
            })
        ]
    };

    return config;
}