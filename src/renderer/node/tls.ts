import {makeLazy} from "@common/util";

export default window.require ? window.require("tls") : makeLazy(() => PCCompatNative.getBinding("tls"));
