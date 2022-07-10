import {makeLazy} from "@common/util";

export default window.require ? window.require("path") : makeLazy(() => PCCompatNative.getBinding("crypto"));
