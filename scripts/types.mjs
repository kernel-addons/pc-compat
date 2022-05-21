import https from "https";
import fs from "fs";
import path from "path";

const list = [
    {
        name: "electron",
        url: "https://unpkg.com/electron@latest/electron.d.ts",
        filename: "electron.d.ts"
    }
];

const fetch = (url) => new Promise(resolve => {
    https.get(url, resp => {
        if (resp.statusCode === 302 || resp.statusCode === 303) {
            const newUrl = resp.headers.location.indexOf("http") === 0 ? resp.headers.location : (() => {
                const urlObject = new URL(url);

                return urlObject.origin + resp.headers.location;
            })();

            return fetch(newUrl).then(resolve);
        }

        const data = [];

        resp.on("data", chunk => data.push(chunk));
        resp.on("end", () => {
            resolve({
                text: () => data.join(""),
                json: () => JSON.parse(data.join("")),
                buffer: () => Buffer.from(data)
            });
        });
    });
});

async function main() {
    console.log("⌛ Downloading & Installing types...");

    const installed = new Set();
    const folder = path.resolve("types");
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    for (const type of list) {
        try {
            const data = (await fetch(type.url)).text();
            const typesPath = path.resolve(folder, type.filename);

            fs.writeFileSync(typesPath, data, "utf8");

            installed.add(type.name);
        } catch (error) {
            console.error(`❌ Failed to download types for ${type.name}:`, error);
        }
    }

    if (installed.size) {
        console.log("✅ Successfully installed types:\n", [...installed].map(i => " \x1B[36m*\x1B[37m " + i).join("\n"));
    } else {
        console.log("❌ Failed to install types.");
    }
};

main();