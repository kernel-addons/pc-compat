import DiscordModules from "@modules/discord";
import Git from "@modules/simplegit";
import {path} from "@node";

const root = PCCompatNative.getBasePath();
const kernelPath = path.resolve(root, "..", "..");

const info = {
    currentCommit: "Loading...",
    currentBranch: "HEAD",
    kernelCommit: "Loading...",
    kernelBranch: "HEAD"
};

Promise.all([
    Git.getLatestCommit(root),
    Git.getBranchName(root),
    Git.getLatestCommit(kernelPath),
    Git.getBranchName(kernelPath)
] as unknown as any[]).then(([{short: pcCommit}, pcBranch, {short: kernelCommit}, kernelBranch]) => {
    Object.assign(info, {
        currentCommit: pcCommit,
        currentBranch: pcBranch,
        kernelCommit,
        kernelBranch
    });
}).catch(() => {});

Git.getLatestCommit(root).then(args => {
    info.currentCommit = (args as unknown as {short: string}).short; 
});

export const renderElement = function (contents: string) {
    const {Text} = DiscordModules;

    return (
        <Text size={Text.Sizes.SIZE_12} color={Text.Colors.MUTED} className="pc-version-tag">
            {contents}
        </Text>
    );
}

export default function VersionTag({kernel}) {
    const {currentCommit, currentBranch, kernelBranch, kernelCommit} = info;

    return (
        <React.Fragment>
            {renderElement(`Powercord ${currentBranch} (${currentCommit})`)}
            {kernel && kernelBranch != null && kernelCommit != null && renderElement(`Kernel ${kernelBranch} (${kernelCommit})`)}
        </React.Fragment>
    )
};