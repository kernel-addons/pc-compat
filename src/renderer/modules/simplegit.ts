const period = "@@@===@@@";
const commitFields = ["hash", "hash_short", "author", "date", "message"];
const hashFields = ["short", "full"];

export default class Git {
    static async executeCmd(cmd: string, cwd?: string) {
        return PCCompatNative.runCommand(cmd, cwd);
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
            
            return result.trim() === "true";
        } catch {
            return false;
        }
    }

    static async getRemoteURL(cwd: string): Promise<string> {
        try {
            return (await this.executeCmd("git config --get remote.origin.url", cwd)).trim();
        } catch (error) {
            console.error(error);
            return null;
        }
    } 

    static async getBranches(cwd: string) {
        try {
            const raw = (await this.executeCmd("git branch -r", cwd)).replaceAll(" ", "").replaceAll("origin/", "").trimEnd();

            return raw.split("\n");
        } catch (error) {
            console.error(error);
            return null;
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
            await this.executeCmd("git fetch", cwd);
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