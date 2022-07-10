import {makeLazy} from "@common/util";

export default window.require ? window.require("querystring") : makeLazy(() => PCCompatNative.getBinding("querystring"));
