type PathModule = typeof import("src/preload/bindings").path;

export default !window.process || process.contextIsolated ? PCCompatNative.getBinding("path") as PathModule :  window.require("path");
