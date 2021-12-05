const zlib: typeof import("zlib") = PCCompatNative.executeJS(`require("zlib")`);

export default zlib;