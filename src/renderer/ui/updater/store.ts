import {Store} from "@classes";
import {DataStore} from "@modules";
import {promise} from "@modules/discord";
import {GithubRelease} from "@modules/github";
import {defaultSettings} from "./components/settings";

export type CoreUpdate = {
    release: GithubRelease,
    from: string;
    to: string;
};

export type AddonUpdate = {
    name: string;
    repoUrl: string;
    path: string;
    branch: string;
    entityId: string;
    currentCommit: {
        full: string;
        short: string;
    };
    commits: {
        hash: string;
        hash_short: string;
        author: string;
        date: string;
        message: string
    }[];
};

export type Update = {
    type: "addon" | "core";
    api: "git" | "github";
    id: string;
    failed: boolean;
    ignored: boolean;
} & (CoreUpdate | AddonUpdate);

export const DEFAULT_CONFIG = {
    lastCheckedUpdate: "---",
    ...defaultSettings
};

const UpdatesStore = new class UpdatesStore extends Store<string> {
    #state: {
        updates: Update[];
        lastCheckedUpdate: string;
        isFetching: boolean;
        isUpdatingAll: boolean;
        ignoredUpdates: Set<string>;
    } = {
        updates: [],
        lastCheckedUpdate: DEFAULT_CONFIG.lastCheckedUpdate,
        isFetching: false,
        isUpdatingAll: false,
        ignoredUpdates: new Set()
    };

    loadData() {return DataStore.tryLoadData("updater", DEFAULT_CONFIG);}

    initialize() {
        const data = this.loadData();
        this.#state.lastCheckedUpdate = data.lastCheckedUpdate;
        this.#state.ignoredUpdates = new Set(data.ignoredUpdates);
    }

    getUpdates() {return this.#state.updates;}

    getLastCheckedUpdate() {return this.#state.lastCheckedUpdate;}

    setUpdates(updates: Update[]) {
        this.#state.updates = updates;

        this.emitChange();
    }

    removeUpdate(id: string) {
        const index = this.getUpdates().indexOf(this.getUpdate(id) as Update);
        if (index < 0) return false;

        this.#state.updates.splice(index, 1);
        this.#state.updates = [...this.#state.updates];
        this.emitChange();
    }

    getUpdate(id: string) {
        const index = this.getUpdates().findIndex(u => u.id === id);
        if (index < 0) return false;

        return this.getUpdates()[index];
    }

    updateLastCheckedUpdate() {
        this.#state.lastCheckedUpdate = new Date().toJSON();

        DataStore.trySaveData("updater", {
            ...DataStore.tryLoadData("updater", DEFAULT_CONFIG),
            lastCheckedUpdate: this.#state.lastCheckedUpdate
        });

        this.emitChange();
    }

    getPendingUpdateCount() {return this.getUpdates().filter(u => !this.isIgnored((u as AddonUpdate).entityId ?? u.type)).length;}

    isUpdatingAll() {return this.#state.isUpdatingAll;}

    startUpdatingAll() {
        this.#state.isUpdatingAll = true;
        this.emitChange();
    }

    stopUpdatingAll() {
        this.#state.isUpdatingAll = false;
        this.emitChange();
    }

    isFetching() {return this.#state.isFetching;}

    startFetching() {
        this.#state.isFetching = true;
        this.emitChange();
    }

    stopFetching() {
        this.#state.isFetching = false;
        this.emitChange();
    }

    isIgnored(name: string) {return this.#state.ignoredUpdates.has(name);}

    ignore(name: string) {
        if (this.#state.ignoredUpdates.has(name)) return;

        this.#state.ignoredUpdates.add(name);

        DataStore.trySaveData("updater", {
            ...this.loadData(),
            ignoredUpdates: Array.from(this.#state.ignoredUpdates)
        });

        this.emitChange();
    }

    acknowledge(name: string) {
        if (!this.#state.ignoredUpdates.has(name)) return;

        this.#state.ignoredUpdates.delete(name);

        DataStore.trySaveData("updater", {
            ...this.loadData(),
            ignoredUpdates: Array.from(this.#state.ignoredUpdates)
        });

        this.emitChange();
    }
};

promise.then(() => UpdatesStore.initialize());

export default UpdatesStore;