import Patcher from "../modules/patcher";

export function inject(id: string, module: string, functionName: string, callback: any, pre = false) {
    if (!module || typeof (module[functionName]) !== "function") throw new Error(`Failed to patch ${id}; module or functionName was invalid.`);

    if (pre) {
        Patcher.before(id, module, functionName, (_this: any, args: any) => {
            return Reflect.apply(callback, _this, [args]);
        });
    } else {
        Patcher.after(id, module, functionName, (_this: any, args: any, ret: any) => {
            return Reflect.apply(callback, _this, [args, ret]);
        });
    }
};

export function uninject(id: string) {
    return Patcher.unpatchAll(id);
};

export function isInjected(id: string) {
    return Patcher.getPatchesByCaller(id).length > 0;
};

const injector = {inject, uninject, isInjected};

export default injector;