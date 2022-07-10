type FsModule = typeof import("src/preload/bindings/fs").default;

export default window.require ? window.require("fs") : PCCompatNative.getBinding("fs") as FsModule;
