const methods: String[] = PCCompatNative.executeJS(`Object.keys(require("tls"))`);

const tls = {};
for(const key of methods) {
   // @ts-ignore
   tls[key] = PCCompatNative.executeJS(`require("tls").${key}`)
}

export default tls;