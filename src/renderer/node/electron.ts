type ElectronModule = typeof import("src/preload/bindings/electron").default;

export default PCCompatNative.getBinding("electron") as ElectronModule;
