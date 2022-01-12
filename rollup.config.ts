import swc from "rollup-plugin-swc";
import {defineConfig} from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import {uglify} from "rollup-plugin-uglify";

const aliases = {
    "@powercord":   path.resolve(__dirname, "./src/renderer/powercord"),
    "@data":        path.resolve(__dirname, "./src/renderer/data"),
    "@modules":     path.resolve(__dirname, "./src/renderer/modules"),
    "@ui":          path.resolve(__dirname, "./src/renderer/ui"),
    "@node":        path.resolve(__dirname, "./src/renderer/node"),
    "@common":      path.resolve(__dirname, "./src/common"),
    "@classes":     path.resolve(__dirname, "./src/renderer/classes"),
    "@flux":        path.resolve(__dirname, "./src/renderer/flux"),
    "@decorators":  path.resolve(__dirname, "./src/renderer/decorators")
};

export default args => {
    const {mode = "renderer", minify = true} = args;
    delete args.mode;
    delete args.minify;

    return defineConfig({
        input: `./src/${mode}/index.ts`,
        external: [
            "electron",
            "fs",
            "path",
            "module",
            "sucrase",
            "sass",
            "inspector",
            "@electron/remote/main",
            "@electron/remote/renderer"
        ],
        output: {
            format: mode === "renderer" ? "esm" : "commonjs",
            file: `./dist/${mode}.js`
        },

        plugins: [
            minify && uglify(),
            json(),
            alias({
                entries: aliases
            }),
            resolve({
                browser: mode === "renderer",
                extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
                preferBuiltins: false,
            }),
            swc({
                minify: true,
                jsc: {
                    parser: {
                        tsx: true,
                        syntax: "typescript",
                        decorators: true
                    },
                    target: "es2022",
                    minify: {
                        compress: {
                            arguments: false,
                            dead_code: true,
                            keep_classnames: true
                        }
                    },
                    transform: {
                        react: {useBuiltins: true}
                    }
                }
            })
        ].filter(Boolean),
        // onwarn: (message) => {
        //     // if (IGNORED_WARNINGS.includes(message.code)) return; // Hide this annoying thing
        //     return console.error(message.message);
        // }
    });
};