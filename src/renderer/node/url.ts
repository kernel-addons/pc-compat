import {makeLazy} from "@common/util";

export default makeLazy(() => window.require ? window.require("url") : PCCompatNative.getBinding("url"));
