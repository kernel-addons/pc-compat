import swc from "rollup-plugin-swc";
import {defineConfig} from "rollup";
import esFormatter from "rollup-plugin-esformatter";
import {nodeResolve} from "@rollup/plugin-node-resolve";

const IGNORED_WARNINGS = ["EVAL", "THIS_IS_UNDEFINED"];

export default args => {
    const {mode = "renderer"} = args;
    delete args.mode;

    return defineConfig({
        input: `./src/${mode}/index.ts`,
        external: ["electron", "fs", "path", "module", "sucrase", "sass", "inspector"],
        output: {
            format: mode === "renderer" ? "esm" : "commonjs",
            file: `${mode}.js`
        },

        plugins: [
            nodeResolve({
                browser: mode === "renderer",
                extensions: [".ts", ".tsx", ".js", ".jsx"],
                preferBuiltins: false
            }),
            esFormatter({
                plugins: ["esformatter-quotes"],
                quotes: {
                    type: "double"
                },
                indent: {
                    value: "\t"
                }
            }),
            swc({
                jsc: {
                    parser: {
                        tsx: true,
                        syntax: "typescript",
                        decorators: true
                    },
                    target: "es2019"
                }
            })
        ],
        // onwarn: (message) => {
        //     if (IGNORED_WARNINGS.includes(message.code)) return; // Hide this annoying thing
        //     return console.error(message);
        // }
    });
};