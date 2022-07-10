import {makeLazy} from "@common/util";

type OSModule = typeof import("src/preload/bindings").os;

export default window.require ? window.require("os") : makeLazy(() => PCCompatNative.getBinding("os") as OSModule);
