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

Promise.all([Git.getBranchName(root), Git.getBranchName(kernelPath)]).then(([pcBranch, kernelBranch]) => {
   Promise.all([
        Git.getLatestCommit(root, pcBranch),
        Git.getLatestCommit(kernelPath, kernelBranch),
   ] as unknown as any[]).then(([{short: pcCommit}, {short: kernelCommit}]) => {
        info.currentCommit = pcCommit;
        Object.assign(info, {
            currentCommit: pcCommit,
            currentBranch: pcBranch,
            kernelCommit,
            kernelBranch
        });
   }).catch(() => {});
})

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