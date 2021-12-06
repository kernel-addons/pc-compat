import {DataStore} from "../../modules";
import DiscordModules, {promise} from "../../modules/discord";

let SettingsModule;

promise.then(() => {
    SettingsModule = class SettingsModule<T = any> extends DiscordModules.Flux.Store {
        settings: any;

        id: string;

        constructor(id: string) {
            super(DiscordModules.Dispatcher, {});

            this.settings = DataStore.tryLoadData(id);
            this.id = id;
        }

        getKeys = () => {return Reflect.ownKeys(this.settings);}

        get = <def = any>(id: string, defaultValue?: def): def => {return this.settings[id] ?? defaultValue;}

        toggle = (id: string) => {
            this.set(id, !this.get(id));
        }

        set = (id: string, value: any) => {
            if (value === void 0) {
                this.toggle(id);
            } else {
                this.settings[id] = value;
            }

            this.save();
        }

        save = () => {
            DataStore.trySaveData(this.id, this.settings);
            this.emitChange();
        }

        connectStore() {
            return DiscordModules.Flux.connectStores([this], () => this.makeProps());
        }

        makeProps() {
            return {
                settings: this.settings,
                getSetting: this.get.bind(this),
                updateSetting: this.set.bind(this),
                toggleSetting: this.toggle.bind(this)
            };
        }
    }
});

export const cache = new Map<string, any>();

export function getSettings(id: string): any {
    if (!cache.has(id)) {
        const Settings = new SettingsModule(id);
        cache.set(id, Settings);

        Settings.save();

        return Settings;
    }

    return cache.get(id);
};