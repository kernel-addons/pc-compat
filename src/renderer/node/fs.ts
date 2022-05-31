type FsModule = typeof import("src/preload/bindings/fs").default;

export default PCCompatNative.getBinding("fs") as FsModule;
