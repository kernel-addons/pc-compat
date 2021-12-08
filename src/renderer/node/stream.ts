const methods: String[] = PCCompatNative.executeJS(`Object.keys(require("stream"))`);

const stream = {};
for(const key of methods) {
   // @ts-ignore
   stream[key] = PCCompatNative.executeJS(`require("stream").${key}`)
}

export default stream;