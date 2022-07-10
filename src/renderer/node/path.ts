type PathModule = typeof import("src/preload/bindings").path;

export default window.require ? window.require("path") : PCCompatNative.getBinding("path") as PathModule;
