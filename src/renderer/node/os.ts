import {makeLazy} from "@common/util";

type OSModule = typeof import("src/preload/bindings").os;

export default makeLazy(() => PCCompatNative.getBinding("os") as OSModule);
