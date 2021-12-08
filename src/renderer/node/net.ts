const methods: String[] = PCCompatNative.executeJS(`Object.keys(require("net"))`);

const net = {};
for(const key of methods) {
   // @ts-ignore
   net[key] = PCCompatNative.executeJS(`require("net").${key}`)
}

export default net;