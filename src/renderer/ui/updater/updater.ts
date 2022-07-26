import UpdatesStore, {AddonUpdate, CoreUpdate, DEFAULT_CONFIG} from "./store";
import PluginManager from "@powercord/pluginmanager";
import StyleManager from "@powercord/stylemanager";
import DataStore from "@modules/datastore";
import Github from "@modules/github";
import Git from "@modules/simplegit";

const UpdaterNative = PCCompatNative.getBinding("updater") as typeof import("src/preload/bindings/updater");
const getId = (() => {
    let id = 0;

    return () => id++;
})();

export default class Updater {
    static async installCoreUpdate(url: string, encoding: string) {
        if (!PCCompatNative.isPacked) {
            return Git.executeCmd("git pull", PCCompatNative.getBasePath());
        }

        return UpdaterNative.update(url, PCCompatNative.getBasePath(), encoding);
    }

    static async installAddonUpdate(path: string, force: boolean) {
        if (force) await Git.executeCmd("git reset --hard", path);
        await Git.executeCmd("git pull", path);
    }

    static async processUpdateCheck(addon: ReturnType<typeof PluginManager.get> | ReturnType<typeof StyleManager.get>) {
        if (!(await Git.isGitRepo(addon.path))) return null;
        const branch = await Git.getBranchName(addon.path);
        const diff = await Git.getDiff(addon.path, branch);
        if (!diff.length) return null;

        return {
            type: "addon",
            api: "git",
            commits: diff,
            name: addon.displayName,
            path: addon.path,
            branch,
            currentCommit: await Git.getLatestCommit(addon.path, branch),
            repoUrl: await Git.getRemoteURL(addon.path),
            id: getId(),
            failed: false,
            entityId: addon.entityID
        };
    }

    static async processCoreUpdateCheck() {
        if (!PCCompatNative.isPacked) {
            const path = PCCompatNative.getBasePath();
            const branch = await Git.getBranchName(path);
            const changes = await Git.getDiff(path, branch);
            if (!changes.length) return null;

            return {
                type: "core",
                api: "git",
                commits: changes,
                id: getId(),
                failed: false,
                repoUrl: await Git.getRemoteURL(path),
                currentCommit: await Git.getLatestCommit(path, branch),
                branch
            };
        }

        return Github.fetchRelease().then(release => {
            if ((release as any).message?.indexOf("API rate limit exceeded") > -1) return null;
            if (Github.hasUpdateAvailable(release)) {
                return {
                    type: "core",
                    from: Github.currentRelease,
                    to: release.name,
                    api: "github",
                    release: release,
                    id: getId(),
                    failed: false
                };
            }
        });
    }

    static async fetchPendingUpdates () {
        type Update = Awaited<ReturnType<typeof this.processUpdateCheck>>;

        const updates: Update[] = [];
        const checks = []
            .concat(PluginManager.addons, StyleManager.addons)
            .map(addon => () => this.processUpdateCheck(addon));

        checks.unshift(() => this.processCoreUpdateCheck() as unknown as any);

        if (this.getSetting("useQueue", false)) {
            for (const check of checks) {
                const result = await check();
                if (result) updates.push(result);
            }
        }
        else {
            await Promise.allSettled(checks.map(async check => {
                const result = await check();
                if (result) updates.push(result);
            }));
        }

        return updates;
    }

    static async fetchAllUpdates() {
        if (!await Git.hasGitInstalled()) return;

        UpdatesStore.startFetching();

        return this.fetchPendingUpdates().then((updates) => {
            UpdatesStore.stopFetching();
            UpdatesStore.setUpdates(updates as unknown as any);
            UpdatesStore.updateLastCheckedUpdate();
        });
    }

    static async updateAll() {
        if (!await Git.hasGitInstalled()) return;

        UpdatesStore.startUpdatingAll();

        for (const update of UpdatesStore.getUpdates()) {
            if (UpdatesStore.isIgnored((update as AddonUpdate).entityId ?? update.type)) continue;

            switch (update.type) {
                case "addon": {
                    try {
                        await Updater.installAddonUpdate((update as AddonUpdate).path, false);
                    } catch (error) {
                        console.error(error);
                        update.failed = true;
                    }
                } break;

                case "core": {
                    try {
                        const asset = (update as CoreUpdate).release.assets.find(c => c.name === "powercord.asar");
                        await Updater.installCoreUpdate(asset.url, asset.content_type);
                    } catch (error) {
                        console.error(error);
                        update.failed = true;
                    }
                } break;
            }

            UpdatesStore.removeUpdate(update.id);
        }

        UpdatesStore.stopUpdatingAll();
        UpdatesStore.emitChange();
    }

    static getSetting<T>(id: string, def: T): T {
        return DataStore.tryLoadData("updater", DEFAULT_CONFIG)[id] ?? def;
    }
}
