import swc from "rollup-plugin-swc";
import {defineConfig} from "rollup";
import esFormatter from "rollup-plugin-esformatter";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import alias from "@rollup/plugin-alias";
import sourcemaps from "rollup-plugin-sourcemaps";
import json from "@rollup/plugin-json";

const aliases = {
    "@powercord":   path.resolve(__dirname, "./src/renderer/powercord"),
    "@data":        path.resolve(__dirname, "./src/renderer/data"),
    "@modules":     path.resolve(__dirname, "./src/renderer/modules"),
    "@ui":          path.resolve(__dirname, "./src/renderer/ui"),
    "@node":        path.resolve(__dirname, "./src/renderer/node"),
    "@common":      path.resolve(__dirname, "./src/common"),
    "@classes":     path.resolve(__dirname, "./src/renderer/classes"),
    "@flux":        path.resolve(__dirname, "./src/renderer/flux")
};

export default args => {
    const {mode = "renderer", source = true} = args;
    delete args.mode;
    delete args.source;

    return defineConfig({
        input: `./src/${mode}/index.ts`,
        external: ["electron", "fs", "path", "module", "sucrase", "sass", "inspector"],
        output: {
            sourcemap: source,
            format: mode === "renderer" ? "esm" : "commonjs",
            file: `./dist/${mode}.js`
        },

        plugins: [
            json(),
            source && sourcemaps({include: "./src/**"}),
            // AliasLoader(),
            alias({
                entries: mode === "renderer"
                    ? aliases
                    : void 0
            }),
            resolve({
                browser: mode === "renderer",
                extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
                preferBuiltins: false,
            }),
            // Using esFormatter along with sourceMaps: true freezes rollup. Pain.
            !source && esFormatter({
                plugins: ["esformatter-quotes"],
                quotes: {
                    type: "double"
                },
                indent: {
                    value: "\t"
                }
            }),
            swc({
                sourceMaps: source,
                jsc: {
                    parser: {
                        tsx: true,
                        syntax: "typescript",
                        decorators: true
                    },
                    target: "es2019"
                }
            })
        ].filter(Boolean),
        // onwarn: (message) => {
        //     // if (IGNORED_WARNINGS.includes(message.code)) return; // Hide this annoying thing
        //     return console.error(message.message);
        // }
    });
};