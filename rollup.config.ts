import swc from "rollup-plugin-swc";
import {defineConfig} from "rollup";
import esFormatter from "rollup-plugin-esformatter";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import fs from "fs";
import alias from "@rollup/plugin-alias";

const IGNORED_WARNINGS = ["EVAL", "THIS_IS_UNDEFINED"];
const extensions = [".ts", ".tsx", ".js", ".jsx"];
const aliases = {
    "@powercord":   path.resolve(__dirname, "./src/renderer/powercord"),
    "@data":        path.resolve(__dirname, "./src/renderer/data"),
    "@modules":     path.resolve(__dirname, "./src/renderer/modules"),
    "@ui":          path.resolve(__dirname, "./src/renderer/ui"),
    "@node":        path.resolve(__dirname, "./src/renderer/node"),
    "@common":      path.resolve(__dirname, "./src/common"),
    "@classes":     path.resolve(__dirname, "./src/renderer/classes")
};

const AliasLoader = () => {
    const resolveFile = function (_path) {
        let ext = extensions.find(ext => fs.existsSync(_path + ext));
        if (ext) return _path + ext;

        let path1 = resolveFile(_path + "/index");
        if (!fs.existsSync(path1)) return null;
        return path1;
    };

    return {
        resolveId(dep) {
            if (dep[0] !== "@") return null;

            const alias = Object.keys(aliases).find(key => dep.startsWith(key));
            if (!alias) return null;
            return resolveFile(dep.replace(alias, aliases[alias]));
        }
    };
}

export default args => {
    const {mode = "renderer"} = args;
    delete args.mode;

    return defineConfig({
        
        input: `./src/${mode}/index.ts`,
        external: ["electron", "fs", "path", "module", "sucrase", "sass", "inspector"],
        output: {
            format: mode === "renderer" ? "esm" : "commonjs",
            file: `./dist/${mode}.js`
        },

        plugins: [
            // AliasLoader(),
            alias({
                entries: mode === "renderer" 
                    ? aliases
                    : void 0
            }),
            resolve({
                browser: mode === "renderer",
                extensions: [".ts", ".tsx", ".js", ".jsx"],
                preferBuiltins: false,                
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
        onwarn: (message) => {
            // if (IGNORED_WARNINGS.includes(message.code)) return; // Hide this annoying thing
            return console.error(message.message);
        }
    });
};