import {makeLazy} from "@common/util";

type OSModule = typeof import("src/preload/bindings").os;

export default makeLazy(() => !window.process || process.contextIsolated ? PCCompatNative.getBinding("os") as OSModule : window.require("os"));
