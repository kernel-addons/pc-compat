import {makeLazy} from "@common/util";

type OSModule = typeof import("src/preload/bindings").os;

export default makeLazy(() => window.require ? window.require("os") : PCCompatNative.getBinding("os") as OSModule);
