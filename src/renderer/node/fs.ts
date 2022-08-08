type FsModule = typeof import("src/preload/bindings/fs").default;

const fs = !window.process || process.contextIsolated ? PCCompatNative.getBinding("fs") as FsModule : window.require("fs");

fs.readFileSync = (readFileSync => (...args) => {
    let res = readFileSync(...args);

    if (res instanceof Uint8Array) {
        res = Buffer.from(res);
    }

    return res;
})(fs.readFileSync);

export default fs;
