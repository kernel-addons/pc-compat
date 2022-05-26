type PathModule = typeof import("src/preload/bindings").path;

export default PCCompatNative.getBinding("path") as PathModule;
