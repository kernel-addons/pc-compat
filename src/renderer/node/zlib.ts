import {makeLazy} from "@common/util";

export default window.require ? window.require("zlib") : makeLazy(() => PCCompatNative.getBinding("zlib"));