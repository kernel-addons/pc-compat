const stream: typeof import("stream") = PCCompatNative.executeJS(`require("stream")`);

export default stream;