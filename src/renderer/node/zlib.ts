import {makeLazy} from "@common/util";

export default makeLazy(() => window.require ? window.require("zlib") : PCCompatNative.getBinding("zlib"));