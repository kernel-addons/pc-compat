import {createPackage} from "asar"; 
import {promises as fs} from "fs";
import path from "path";
import CP from "child_process";
import Crypto from "crypto";

const root = process.cwd();
const dist = path.resolve(root, "dist");
const tempPath = path.resolve(dist, "temp");
const asarPath = path.resolve(dist, "powercord.asar");

const emojis = {
    success: "✅",
    failure: "❌",
    progress: "⌛"
};

// Utils
async function exists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

async function exec(cmd, options = {}) {
    return new Promise((resolve, reject) => {
        CP.exec(cmd, options, (error, stdout) => {
            if (error) return reject(error);
            resolve(stdout);
        })
    });
}

// Main code
async function main() {
    if (!(await exists(tempPath))) {
        console.log(`${emojis.progress} Creating temp directory...`);
        await fs.mkdir(tempPath);
    }

    // Copy the package.json to the temp folder
    {
        console.log(`${emojis.progress} Copying package.json to temp directory...`);

        const packageJson = path.resolve(root, "package.json");
        const tempPackageJson = path.resolve(tempPath, "package.json");

        await fs.copyFile(packageJson, tempPackageJson);
    }

    // Install fresh npm dependencies
    if (!(await exists(path.resolve(tempPath, "node_modules")))) {
        console.log(`${emojis.progress} Installing npm dependencies...`);

        await new Promise((resolve, reject) => {
            CP.exec("npm install --only=production", {cwd: tempPath}, (error) => {
                if (error) {
                    console.log(`${emojis.failure} Failed to install npm dependencies:`);
                    return reject(error);
                }

                console.log(`${emojis.success} Successfully installed npm dependencies.`);
                resolve();
            });
        });

    }
    
    // Removing npm configs
    {
        console.log(`${emojis.progress} Removing npm configs from temp directory...`);

        const tempPackageJson = path.resolve(tempPath, "package.json");
        const tempPackageLock = path.resolve(tempPath, "package-lock.json");

        if (await exists(tempPackageJson)) await fs.unlink(tempPackageJson);
        if (await exists(tempPackageLock)) await fs.unlink(tempPackageLock);
    }

    // Copy dist
    {
        const files = ["renderer.js", "style.css", "preload.js", "main.js"];

        for (const file of files) {
            const filePath = path.resolve(dist, file);

            if (await exists(filePath)) {
                const tempLocation = path.resolve(tempPath, file);

                console.log(`${emojis.progress} Copying file ${file}`);
                await fs.copyFile(filePath, tempLocation);
            } else {
                console.log(`${emojis.failure} Missing file ${file} in dist.`);
                process.exit();
            }
        }
    }

    // Write git info 
    {
        console.log(`${emojis.progress} Writing git info...`);

        const gitInfoPath = path.resolve(tempPath, "git.json");
        const branchName = await exec("git branch -a").then(stdout => stdout.slice(2, stdout.indexOf("\n")));
        const latestCommit = await new Promise(resolve => {
            const period = "@@@===@@@";
            const parsePeriods = (fields, out) => {
                return Object.fromEntries(out.split(period).map((c, i) => [fields[i], c]));
            };

            resolve(
                exec(`git log -1 ${branchName} --pretty=format:"%h${period}%H"`)
                    .then(stdout => parsePeriods(["short", "full"], stdout))
            );
        });

        const data = {
            branchName,
            latestCommit
        };

        await fs.writeFile(gitInfoPath, JSON.stringify(data, null, 4));
    }

    // Copy kernel manifest
    {
        const manifestPath = path.resolve(root, "index.json");
        const tempLocation = path.resolve(tempPath, "index.json");

        await fs.copyFile(manifestPath, tempLocation);
    }

    // Pack everything inside powercord.asar
    {
        console.log(`${emojis.progress} Packing everything into powercord.asar...`);

        await createPackage(tempPath, asarPath);
    }

    // Creating hash
    {
        console.log(`${emojis.progress} Creating hash...`);

        const buffer = await fs.readFile(asarPath);
        const hash = Crypto.createHash("sha256").update(buffer).digest("hex");
        const hashPath = path.resolve(dist, "hash.txt");

        await fs.writeFile(hashPath, `SHA-256: ${hash}`);
    }

    console.log(`${emojis.success} Successfully packaged powercord.asar`);
}

main();