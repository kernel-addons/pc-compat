import {Store} from "@classes";
import fs from "@node/fs";
import path from "@node/path";
import {default as Require} from "@node/require";
import {getProps, setProps} from "./utilities";
import LoggerModule from "./logger";

const Logger = LoggerModule.create("DataStore");

const DataStore = new class DataStore extends Store<"misc" | "data-update"> {
    constructor() {
        super();

        if (!fs.existsSync(this.configFolder)) {
            try {
                fs.mkdirSync(this.configFolder);
            } catch (error) {
                Logger.error("Failed to create config folder:", error);
            }
        }
    }

    baseDir: string = path.resolve(PCCompatNative.getBasePath());

    configFolder = path.resolve(this.baseDir, "config");

    cache = new Map();

    tryLoadData(name: string, def: any = {}) {
        if (this.cache.has(name)) return this.cache.get(name);

        try {
            const location = path.resolve(this.configFolder, `${name}.json`);
            if (!fs.existsSync(location)) return def;
            const data = Require(location);
            if (Object.keys(data).length === 0) return def;
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
        this.trySaveData("misc", _.set(misc, prop.split("."), value))
        this.emit("misc");
    }
}

export default DataStore;