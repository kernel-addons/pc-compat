import {makeLazy} from "@common/util";

export default makeLazy(() => !window.process || process.contextIsolated ? PCCompatNative.getBinding("zlib") : window.require("zlib"));