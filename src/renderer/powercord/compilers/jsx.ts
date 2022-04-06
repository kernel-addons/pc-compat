import path from "@node/path";
import {default as FS} from "@node/fs";
import LoggerModule from "@modules/logger";
import {require as Require} from "@node";

const fs = FS.promises;
const Logger = new LoggerModule("JSXCompiler");

const loaderReplace = `const path = require('path').join(__dirname, 'wasm_bg.wasm');`;

const loaderReplacement = `
module.exports.__promise__ = (async () => {
    const binary = require("fs").readFileSync(require("path").join(PCCompatNative.getBasePath(), "lib/swc.wasm"));
    const wasmModule = await WebAssembly.instantiate(binary, imports);
    module.exports.__wasm = wasm = wasmModule.instance.exports;
})();
`.trim();

export default class JSXCompiler {
    static get libPath() {return path.resolve(PCCompatNative.getBasePath(), "lib");}
    static get swcLoader() {return path.resolve(this.libPath, "swc.wasm.js");}

    static swc: {
        __promise__: Promise<void>;
        transformSync(code: string, opts: any): {code: string};
    } = null;

    static urls = {
        loader: "https://unpkg.com/@swc/wasm@1.2.161/wasm.js",
        wasm: "https://unpkg.com/@swc/wasm@1.2.161/wasm_bg.wasm"
    };

    static async ensureBinary() {
        const swcWasm = path.resolve(this.libPath, "swc.wasm");
        
        try {
            await fs.access(this.libPath);
        } catch {
            await fs.mkdir(this.libPath);
        } finally {
            try {
                await fs.access(swcWasm);
            } catch {
                try {
                    const data = await (await fetch(this.urls.wasm)).arrayBuffer();
                    const buffer = new Uint8Array(data);
                    await fs.writeFile(swcWasm, buffer);

                } catch (error) {
                    Logger.error("Failed to install swc wasm binary:", error);
                    return false;
                }
            }

            try {
                await fs.access(this.swcLoader);
            } catch {
                try {
                    let loader = await (await fetch(this.urls.loader)).text();
                    loader = loader.replace("const { TextDecoder, TextEncoder } = require(`util`);", "");
                    const index = loader.indexOf(loaderReplace);
                    loader = loader.slice(0, index) + loaderReplacement;

                    await fs.writeFile(this.swcLoader, loader, "utf8");
                } catch (error) {
                    Logger.error("Failed to install swc wasm loader:", error);
                    return false;
                }
            }
        }

        return true;
    }

    static async initialize(): Promise<void> {
        const success = await this.ensureBinary();
        if (!success) throw "Could not initialize.";
        console.log("abc");
        this.swc = Require(this.swcLoader);
        await this.swc.__promise__;
    }

    static compile(file: string): string {
        if (!this.swc) throw "How.";

        return this.swc.transformSync(FS.readFileSync(file, "utf8"), {
            jsc: {
                parser: {
                    jsx: true,
                    syntax: "ecmascript"
                },
                target: "es2021"
            }
        }).code;
    }
}