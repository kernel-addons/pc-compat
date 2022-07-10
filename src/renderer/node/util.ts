import {makeLazy} from "@common/util";

export default window.require ? window.require("util") : makeLazy(() => PCCompatNative.getBinding("util"));
