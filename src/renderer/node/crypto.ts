import {makeLazy} from "@common/util";

export default makeLazy(() => window.require ? window.require("crypto") : PCCompatNative.getBinding("crypto"));
