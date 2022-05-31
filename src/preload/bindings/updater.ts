import https from "https";

export const update = async (url: string, path: string, encoding: string) => {
    const {promises: fs} = await import("original-fs");
    const buffer = await new Promise<Buffer>(resolve => {
        const fetchUrl = function (url: string) {
            https.get(url, {
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

    return fs.writeFile(path, buffer);
};