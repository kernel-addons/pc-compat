import fs from "fs";

const {contextIsolated = true} = process;
const newFs = {} as any as typeof fs;
const needsFixed = new Set(["stat", "statSync"]);

const fix = ret => {
    if (typeof ret !== "object" || ret === null) return ret;

    let clone = {};

    for (const prop in ret) {
        clone[prop] =
            typeof ret[prop] === "function" ? ret[prop].bind(ret) : ret[prop];
    }

    return clone;
};

const clone = (prop = "", async = false, ignore = new Set()) => {
    const cloned = {};

    const source = prop ? fs[prop] : fs;
    for (const key of Object.keys(source)) {
        if (ignore.has(key)) continue;
        if (typeof source[key] !== "function") {
            cloned[key] = source[key];
            continue;
        }

        cloned[key] = needsFixed.has(key)
            ? (...args: any[]) => {
                if (async) {
                    return source[key](...args).then(fix);
                }

                if (!key.endsWith("Sync")) {
                    const fn = args[args.length - 1]; 
                    args[args.length - 1] = (...args) => fn(...args.map(fix));
                    
                    source[key](...args);
                } else {
                    return fix(source[key](...args));
                }
            }
            : (...args: any[]) => {
                return source[key](...args);
            };
    }

    Object.assign(newFs, prop ? {[prop]: cloned} : cloned);
};

clone(undefined, undefined, new Set(["promises"]));
clone("promises", true);

export default contextIsolated ? newFs : fs;