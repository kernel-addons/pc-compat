export default {
    parse: (...args) => PCCompatNative.executeJS(`
        PCCompatNative.cloneObject(require("url").parse(${args.map(e => JSON.stringify(e)).join(", ")}));
    `)
}