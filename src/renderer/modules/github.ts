import path from "@node/path";
import fs from "@node/fs";

export type GithubRelease = {
    url: string;
    assets_url: string;
    upload_url: string;
    html_url: string;
    id: number;
    author: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
    };
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    created_at: string;
    published_at: string;
    assets: {
        url: string;
        id: number;
        node_id: string;
        name: string;
        label: string;
        uploader: {
            login: string;
            id: number;
            node_id: string;
            avatar_url: string;
            gravatar_id: string;
            url: string;
            html_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            starred_url: string;
            subscriptions_url: string;
            organizations_url: string;
            repos_url: string;
            events_url: string;
            received_events_url: string;
            type: string;
        };
        content_type: string;
        state: string;
        size: number;
        download_count: number;
        created_at: string;
        updated_at: string;
        browser_download_url: string;
    }[];
    tarball_url: string;
    zipball_url: string;
    body: string;
};

const manifest: typeof import("../../../index.json") = JSON.parse(
    fs.readFileSync(path.resolve(PCCompatNative.getBasePath(), "index.json"), "utf8")
);

export default class Github {
    static releases_url = "https://api.github.com/repos/strencher-kernel/pc-compat/releases/latest";

    static currentRelease = manifest.version;

    static async fetchRelease(): Promise<GithubRelease> {
        const res = await fetch(this.releases_url);
        return res.json() as unknown as GithubRelease;
    }

    static async hasUpdateAvailable(latestRelease: GithubRelease) {
        return latestRelease.name.trim() !== manifest.version.trim();
    }
}
