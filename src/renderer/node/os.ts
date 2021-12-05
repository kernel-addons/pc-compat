const os: typeof import("os") = PCCompatNative.executeJS(`require("os")`);

export default os;