import DiscordModules from "@modules/discord";
import Component from "@classes/component";
import DiscordIcon from "@ui/discordicon";
import Git from "@modules/simplegit";
import Notices from "@ui/notices";

export default class BranchModal extends Component<{onClose: Function, transitionState: number}> {
    static open() {
        DiscordModules.ModalsApi.openModal(props => <BranchModal {...props} />);
    }

    initialBranch: string;
    state = {
        branches: [],
        loaded: false,
        selectedBranch: null
    };

    async componentDidMount() {
        const currentBranch = this.initialBranch = await Git.getBranchName(PCCompatNative.getBasePath());
        const branches = await Git.getBranches(PCCompatNative.getBasePath());

        this.setState({
            branches: branches,
            loaded: true,
            selectedBranch: currentBranch
        });
    }

    renderItem(branch: string) {
        const {Flex} = DiscordModules;
        const isSelected = this.state.selectedBranch === branch;

        return (
            <Flex
                direction={Flex.Direction.HORIZONTAL}
                align={Flex.Align.CENTER}
                onClick={() => this.setState({selectedBranch: branch})}
                className="pc-branch-item"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path transform="translate(2.000000, 2.000000)" fillRule="nonzero" fill="currentColor" d="M4,0 L4,3 L0,3 L0,0 L4,0 Z M12,4 L12,7 L8,7 L8,4 L12,4 Z M8,9 L12,9 L12,12 L8,12 L8,9.33333333 L8,9 Z M7,7 L3,7 L3,10 L7,10 L7,12 L3,12 L1,12 L1,4 L3,4 L3,5 L7,5 L7,7 Z" />
                </svg>
                <Flex.Child grow={1}>
                    <span className="pc-branch-name">{branch}</span>
                </Flex.Child>
                <DiscordIcon name={isSelected ? "RadioSelected" : "RadioEmpty"} foreground={isSelected && "pc-radio-dot"} />
            </Flex>
        );
    }

    switchBranch() {
        if (this.state.selectedBranch === this.initialBranch) return this.props.onClose();

        Git.executeCmd(`git switch ${this.state.selectedBranch}`, PCCompatNative.getBasePath())
            .then(() => {
                Notices.show({
                    timeout: 3000,
                    type: "success",
                    header: "Branch Switched",
                    content: `Successfully switched branch to \`${this.state.selectedBranch}\``,
                    id: "branch-switch-success"
                });
            })
            .catch(error => {
                console.error(error);

                Notices.show({
                    timeout: 3000,
                    type: "danger",
                    header: "Failed",
                    id: "branch-switch-failed",
                    content: "Failed to switch branch. See console for more details."
                });
            });

        this.props.onClose();
    }

    render() {
        const {ModalComponents: {ModalRoot, ModalHeader, ModalContent, ModalFooter, ModalSize, ModalCloseButton}, Header, Flex, Button, Spinner} = DiscordModules;

        return (
            <ModalRoot size={ModalSize.SMALL} {...this.props}>
                <ModalHeader separator={false}>
                    <Header className="pc-modal-title" size={Header.Sizes.SIZE_24}>Select a branch</Header>
                    <ModalCloseButton onClick={this.props.onClose} />
                </ModalHeader>
                <ModalContent className="pc-branch-modal-inner">
                    {
                        this.state.loaded
                            ? this.state.branches.map(branch => this.renderItem(branch))
                            : <Spinner type={Spinner.Type.WANDERING_CUBES} />
                    }
                </ModalContent>
                <ModalFooter>
                    <Flex direction={Flex.Direction.HORIZONTAL} justify={Flex.Justify.END}>
                        <Button
                            look={Button.Looks.LINK}
                            color={Button.Colors.TRANSPARENT}
                            onClick={this.props.onClose}
                        >Cancel</Button>
                        <Button onClick={() => this.switchBranch()}>Select</Button>
                    </Flex>
                </ModalFooter>
            </ModalRoot>
        );
    }
}