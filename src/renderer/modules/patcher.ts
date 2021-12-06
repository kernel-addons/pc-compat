import LoggerModule from "./logger";

const Logger = LoggerModule.create("Patcher");

export default class Patcher {
    static _patches = [];

    static getPatchesByCaller(id) {
        if (!id) return [];
        const patches = [];
        for (const patch of this._patches) for (const childPatch of patch.children) if (childPatch.caller === id) patches.push(childPatch);
        return patches;
    }

    static unpatchAll(caller) {
        const patches = this.getPatchesByCaller(caller);
        if(!patches.length) return;
        for(const patch of patches) patch.unpatch();
    }

    static makeOverride(patch) {
        return function() {
            let returnValue, args: any = arguments;
        
            if (!patch?.children?.length) return patch.originalFunction.apply(this, arguments);
            
            for(const beforePatch of patch.children.filter(e => e.type === "before")) {
                try {
                    const tempArgs = beforePatch.callback(this, args, patch.originalFunction.bind(this));
                    if (Array.isArray(tempArgs)) args = tempArgs;
                } catch (error) {
                    Logger.error(`Could not fire before patch for ${patch.functionName} of ${beforePatch.caller}`, error);
                }
            }

            const insteadPatches = patch.children.filter(e => e.type === "instead");

            if (!insteadPatches.length) returnValue = patch.originalFunction.apply(this, args);
                
            else for(const insteadPatch of insteadPatches) {
                try {
                    const tempReturn = insteadPatch.callback(this, args, patch.originalFunction.bind(this));
                    if(typeof (tempReturn) !== "undefined") returnValue = tempReturn;
                } catch (error) {
                    Logger.error(`Could not fire instead patch for ${patch.functionName} of ${insteadPatch.caller}`, error);
                }
            }

            for(const afterPatch of patch.children.filter(e => e.type === "after")) {
                try {
                    const tempReturn = afterPatch.callback(this, args, returnValue, ret => (returnValue = ret));
                    if(typeof(tempReturn) !== "undefined") returnValue = tempReturn;
                } catch (error) {
                    Logger.error(`Could not fire after patch for ${patch.functionName} of ${afterPatch.caller}`, error);
                }
            }

            return returnValue;
        }
    }

    static pushPatch(caller, module, functionName) {
        const patch = {
            caller,
            module,
            functionName,
            originalFunction: module[functionName],
            undo: () => {
                patch.module[patch.functionName] = patch.originalFunction;
                patch.children = [];
            },
            count: 0,
            children: []
        }

        module[functionName] = this.makeOverride(patch);
        Object.assign(module[functionName], patch.originalFunction, {
            toString: () => patch.originalFunction.toString(),
            __originalFunction: patch.originalFunction
        });

        return this._patches.push(patch), patch;
    }

    static doPatch(caller, module, functionName, callback, type = "after", options = {}) {
        let {displayName} = options as any;
        const patch = this._patches.find(e => e.module === module && e.functionName === functionName) ?? this.pushPatch(caller, module, functionName);
        if(typeof(displayName) !== "string") displayName || module.displayName || module.name || module.constructor.displayName || module.constructor.name;

        const child = {
            caller, 
            type,
            id: patch.count,
            callback,
            unpatch: () => {
                patch.children.splice(patch.children.findIndex(cpatch => cpatch.id === child.id && cpatch.type === type), 1);
                if (patch.children.length <= 0) {
                    const patchNum = this._patches.findIndex(p => p.module == module && p.functionName == functionName);
                    this._patches[patchNum].undo();
                    this._patches.splice(patchNum, 1);
                }
            }
        };
        patch.children.push(child);
        patch.count++;
        return child.unpatch;
    }

    static before(caller, module, functionName, callback) {
        return this.doPatch(caller, module, functionName, callback, "before");
    }

    static after(caller, module, functionName, callback) {
        return this.doPatch(caller, module, functionName, callback, "after");
    }

    static instead(caller, module, functionName, callback) {
        return this.doPatch(caller, module, functionName, callback, "instead");
    }
}