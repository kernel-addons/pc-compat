import {makeLazy} from "@common/util";

export default makeLazy(() => !window.process || process.contextIsolated ? PCCompatNative.getBinding("util") : window.require("util"));
