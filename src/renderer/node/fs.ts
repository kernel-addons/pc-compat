type FsModule = typeof import("src/preload/bindings/fs").default;

export default !window.process || process.contextIsolated ? PCCompatNative.getBinding("fs") as FsModule : window.require("fs");
