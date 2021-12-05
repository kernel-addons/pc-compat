const crypto: typeof import("crypto") = PCCompatNative.executeJS(`require("crypto")`);

export default crypto;