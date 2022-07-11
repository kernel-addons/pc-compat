import {makeLazy} from "@common/util";

export default makeLazy(() => window.require ? window.require("tls") : PCCompatNative.getBinding("tls"));
