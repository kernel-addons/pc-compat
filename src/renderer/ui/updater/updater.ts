import Github from "@modules/github";
import Git from "@modules/simplegit";
import PluginManager from "@powercord/pluginmanager";
import StyleManager from "@powercord/stylemanager";
import UpdatesStore, {AddonUpdate, CoreUpdate} from "./store";

const getId = (() => {
    let id = 0;

    return () => id++;
})();

export default class Updater {
    static async installCoreUpdate(url: string, encoding: string) {
        const installUpdate = PCCompatNative.executeJS(`async (url, path, encoding) => {
            const fs = require("original-fs");
            const buffer = await new Promise(resolve => {
                const fetchUrl = function (url) {
                    require("https").get(url, {
                        headers: {
                            "User-Agent": "Kernel-mod pc-compat",
                            "Accept": encoding
                        }
                    }, res => {
                        if (res.statusCode === 301 || res.statusCode === 302) {
                            return fetchUrl(res.headers.location);
                        }

                        const data = [];
                        res.on("data", chunk => data.push(chunk));
                        res.on("end", () => {
                            resolve(Buffer.concat(data));
                        });
                    });
                };

                fetchUrl(url);
            });

            return fs.promises.writeFile(path, buffer);
        }`);

        return installUpdate(url, PCCompatNative.getBasePath(), encoding);
    }

    static async installAddonUpdate(path: string, force: boolean) {
        if (force) await Git.executeCmd("git reset --hard", path);
        await Git.executeCmd("git pull", path);
    }

    static async fetchPendingUpdates() {
        const updates = [];

        return Promise.allSettled([
            // Github.fetchRelease().then(release => {
            //     if ((release as any).message?.indexOf("API rate limit exceeded") > -1) return;
            //     if (Github.hasUpdateAvailable(release)) {
            //         updates.push({
            //             type: "core",
            //             from: Github.currentRelease,
            //             to: release.name,
            //             api: "github",
            //             release: release,
            //             id: getId(),
            //             failed: false
            //         });
            //     }
            // }),
            ...[...PluginManager.addons, ...StyleManager.addons].map(async addon => {
                if (!(await Git.isGitRepo(addon.path))) return null;
                const branch = await Git.getBranchName(addon.path);
                const diff = await Git.getDiff(addon.path, branch);
                if (!diff.length) return null;

                updates.push({
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
                });
            })
        ]).then(() => updates);
    }

    static async fetchAllUpdates() {
        UpdatesStore.startFetching();

        return this.fetchPendingUpdates().then((updates) => {
            UpdatesStore.stopFetching();
            UpdatesStore.setUpdates(updates);
            UpdatesStore.updateLastCheckedUpdate();
        });
    }

    static async updateAll() {
        UpdatesStore.startUpdatingAll();

        for (const update of UpdatesStore.getUpdates()) {
            switch (update.type) {
                case "addon": {
                    try {
                        await Updater.installAddonUpdate((update as AddonUpdate).path, false);
                        UpdatesStore.removeUpdate(update.id);
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
        }

        UpdatesStore.stopUpdatingAll();
        UpdatesStore.emit("update");
    }
}