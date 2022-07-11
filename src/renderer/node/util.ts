import {makeLazy} from "@common/util";

export default makeLazy(() => window.require ? window.require("util") : PCCompatNative.getBinding("util"));
