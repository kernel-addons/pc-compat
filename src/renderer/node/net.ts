import {makeLazy} from "@common/util";

export default makeLazy(() => window.require ? window.require("net") : PCCompatNative.getBinding("net"));
