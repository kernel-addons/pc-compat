import {makeLazy} from "@common/util";

export default makeLazy(() => window.require ? window.require("querystring") : PCCompatNative.getBinding("querystring"));
