import {makeLazy} from "@common/util";

export default window.require ? window.require("net") : makeLazy(() => PCCompatNative.getBinding("net"));
