import {makeLazy} from "@common/util";

export default window.require ? window.require("url") : makeLazy(() => PCCompatNative.getBinding("url"));
