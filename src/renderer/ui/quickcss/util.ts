import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import LoggerModule from "@modules/logger";
import {fs, path} from "@node";

const Logger = LoggerModule.create("QuickCSS:util");
export const filesPath = path.resolve(PCCompatNative.getBasePath(), "config", "quickcss");

export const createStorage = function () {
    try {
        fs.mkdirSync(filesPath);
    } catch (error) {
        Logger.error("Failed to create QuickCSS folder:", error);
    }

    return [];
};

export const getConfig = function () {
    return DataStore.tryLoadData("quickcss", {files: [], states: {}});
};

export const setConfig = function (items: any) {
    const {Lodash} = DiscordModules;

    return DataStore.trySaveData("quickcss", Lodash.merge({}, getConfig(), items), true, "QUICK_CSS_UPDATE");
};

export const getFiles = function () {
    return getConfig().files.filter(file => fs.existsSync(file));
};

export const closeFile = function (filepath: string) {
    const config = getConfig();
    const index = config.files.indexOf(filepath);
    if (index < 0) return;
    config.files.splice(index, 1);

    DataStore.trySaveData("quickcss", {...config});
};

export const openFile = function (filepath: string) {
    const config = getConfig();
    const index = config.files.indexOf(filepath);
    if (index > -1) return;
    config.files.push(filepath);

    DataStore.trySaveData("quickcss", {...config});
};