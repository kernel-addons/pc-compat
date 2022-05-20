import {default as Require} from "@node/require";
import {getProps} from "./utilities";
import LoggerModule from "./logger";
import {Store} from "@classes";
import path from "@node/path";
import fs from "@node/fs";

const Logger = LoggerModule.create("DataStore");

const DataStore = new class DataStore extends Store<"misc" | "data-update"> {
    constructor() {
        super();

        if (!fs.existsSync(this.configFolder)) {
            try {
                fs.mkdirSync(this.configFolder, {recursive: true});
            } catch (error) {
                Logger.error("Failed to create config folder:", error);
            }
        }

        const basePath = PCCompatNative.getBasePath();
        const previous = path.join(basePath, "config");

        if (fs.existsSync(previous) && !this.getMisc("migratedSettings", false)) {
            Logger.log("Old settings folder detected, migrating settings.")
            const files = fs.readdirSync(previous);

            for (const file of files) {
                // Prepare the paths for moving the old items to the new directory
                const current = path.join(previous, file);
                const to = path.join(this.configFolder, file);

                // Make sure we don't overwrite any themes.
                if (fs.existsSync(to)) continue;

                // Move the file
                Logger.log(`Migrating ${path.basename(basePath)}/${path.basename(previous)}/${file}`);
                fs.renameSync(current, to);
            }

            this.setMisc(void 0, "migratedSettings", true);
            Logger.log("Migration completed.");
        }
    }

    baseDir: string = path.resolve(PCCompatNative.getBasePath(), "..", "..");

    configFolder = path.resolve(this.baseDir, "storage", "strencher.pc-compat");

    cache = new Map();

    tryLoadData(name: string, def: any = {}) {
        if (this.cache.has(name)) return this.merge({}, def, this.cache.get(name));

        try {
            const location = path.resolve(this.configFolder, `${name}.json`);
            if (!fs.existsSync(location)) return def;

            let data = Require(location);
            if (Object.keys(data).length === 0) return def;

            data = this.merge({}, def, data);
            this.cache.set(name, data);

            return data;
        } catch (error) {
            Logger.error(`Data of ${name} corrupt:`, error);
            return def;
        }
    }

    trySaveData(name: string, data: any, emit?: boolean, event: any = "data-update") {
        this.cache.set(name, data);

        try {
            fs.writeFileSync(path.resolve(this.configFolder, `${name}.json`), JSON.stringify(data, null, "\t"), "utf8");
        } catch (error) {
            Logger.error(`Failed to save data of ${name}:`, error);
        }

        if (emit) this.emit(event, name, data);
    }

    getMisc(misc: string = "", def: any) {
        return getProps(this.tryLoadData("misc"), misc) ?? def;
    }

    setMisc(misc: any = this.getMisc("", {}), prop: string, value: any) {
        this.set(misc, prop, value);
        this.trySaveData("misc", misc);
        this.emit("misc", misc, value);
    }

    merge(target, ...sources) {
        for (const source of sources) {
          for (let k in source) {
            let vs = source[k],
                vt = target[k]

            if (Object(vs) == vs && Object(vt) === vt) {
              target[k] = this.merge(vt, vs);
              continue;
            }

            target[k] = source[k];
          }
        }

        return target
    }

    // https://github.com/lukeed/dset
    set(obj, keys, val) {
        keys.split && (keys=keys.split('.'));
        var i=0, l=keys.length, t=obj, x, k;
        while (i < l) {
            k = keys[i++];
            if (k === '__proto__' || k === 'constructor' || k === 'prototype') break;
            t = t[k] = (i === l) ? val : (typeof(x=t[k])===typeof(keys)) ? x : (keys[i]*0 !== 0 || !!~(''+keys[i]).indexOf('.')) ? {} : [];
        }
    }
}

export default DataStore;