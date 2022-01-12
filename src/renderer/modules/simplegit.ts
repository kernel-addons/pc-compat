const period = "@@@===@@@";
const commitFields = ["hash", "hash_short", "author", "date", "message"];
const hashFields = ["short", "full"];

export default class Git {
    static async executeCmd(cmd: string, cwd?: string) {
        return new Promise<string>((resolve, reject) => {
            const id = "GIT_CMD_" + Math.random().toString(36).slice(2);
            PCCompatNative.IPC.on(id, (error, res) => {
                if (error) reject(error);
                else resolve(res);
            });

            PCCompatNative.executeJS(`void require("child_process").exec(${JSON.stringify(cmd)}, {
                cwd: ${JSON.stringify(cwd)}
            }, (error, res) => {
                PCCompatNative.IPC.dispatch(${JSON.stringify(id)}, error, res);
                delete PCCompatEvents[${JSON.stringify(id)}];
            })`);
        });
    }

    static async hasGitInstalled() {
        try {
            await this.executeCmd("git --version");
            return true;
        } catch {return false;}
    }

    static async isGitRepo(cwd: string) {
        try {
            const result = await this.executeCmd("git rev-parse --is-inside-work-tree", cwd);
            
            return result === "true";
        } catch {
            return false;
        }
    }

    static async getBranchName(cwd: string) {
        try {
            const result = await this.executeCmd("git branch -a", cwd);
            if (!result) return null;

            return result.slice(2, result.indexOf("\n"));
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async getLatestCommit(cwd: string, target: string = "master") {
        try {
            return this.parsePeriods(hashFields, await this.executeCmd(`git log -1 ${target} --pretty=format:"%h${period}%H"`, cwd));
        } catch (error) {
            console.error(error);
            return {hasError: true};
        }
    }

    static async getDiff(cwd: string, target: string = "master") {
        try {
            const result = await this.executeCmd(`git log ${target}..origin/${target} --pretty=format:"%H${period}%h${period}%an${period}%ar${period}%s"`, cwd);
            if (!result) return [];
            return result.split("\n").map(p => this.parsePeriods(commitFields, p));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static parsePeriods(fields: string[], out: string) {
        return Object.fromEntries(out.split(period).map((c, i) => [fields[i], c]));
    }
}