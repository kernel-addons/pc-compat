import {Store} from "@classes";
import fs from "@node/fs";
import path from "@node/path";
import {default as Require} from "@node/require";
import {getProps, setProps} from "./utilities";
import Logger from "./logger";

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

    tryLoadData(name: string) {
        try {
            const location = path.resolve(this.configFolder, `${name}.json`);
            if (!fs.existsSync(location)) return {};
            return Require(location);
        } catch (error) {
            Logger.error("DataStore", `Data of ${name} corrupt:`, error);
        }
    } 

    trySaveData(name: string, data: any, emit?: boolean) {
        try {
            fs.writeFileSync(path.resolve(this.configFolder, `${name}.json`), JSON.stringify(data, null, "\t"), "utf8");
        } catch (error) {
            Logger.error("DataStore", `Failed to save data of ${name}:`, error);
        }
        if (emit) this.emit("data-update", name, data);
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