import DiscordModules from "../modules/discord.js";

export default class Modals {
    static showConfirmationModal(title: string, content: any, options = {}) {
        const {confirmText = "Okay", cancelText = "Cancel", onConfirm = () => {}, onCancel = () => {}} = options as any;
        const {ModalsApi, ConfirmationModal, React, Markdown} = DiscordModules;

        return ModalsApi.openModal(props => {
            React.createElement(ConfirmationModal, Object.assign({
                header: title,
                confirmText: confirmText,
                cancelText: cancelText,
                onConfirm,
                onCancel
            }, props),
                React.createElement(Markdown, null, content)
            )
        });
    }

    static alert(title: string, content: any) {
        return this.showConfirmationModal(title, content, {cancelText: null});
    }
}