import DiscordModules from "../modules/discord.js";
import memoize from "../modules/memoize.js";
import Webpack from "../modules/webpack.js";

export default class Modals {
    static get ModalsAPI() {return memoize(this, "ModalsAPI", () => Webpack.findByProps("openModal", "useModalsStore"));}

    static get ModalStack() {return memoize(this, "ModalStack", () => Webpack.findByProps("push", "popAll"));}

    static get ModalComponents() {return memoize(this, "ModalComponents", () => Webpack.findByProps("ModalRoot", "ModalHeader"));}

    static get Forms() {return memoize(this, "Forms", () => Webpack.findByProps("FormTitle", "FormItem"));}

    static get Button() {return memoize(this, "Button", () => Webpack.findByProps("DropdownSizes"));}

    static get ConfirmationModal() {return memoize(this, "ConfirmationModal", () => Webpack.findByDisplayName("ConfirmModal"));}
    static get Text() {return memoize(this, "Text", () => Webpack.findByDisplayName("Text"));}

    static showConfirmationModal(title: string, content: any, options = {}) {
        const {confirmText = "Okay", cancelText = "Cancel", onConfirm = () => {}, onCancel = () => {}} = options as any;

        return this.ModalsAPI.openModal(props => DiscordModules.React.createElement(this.ConfirmationModal, Object.assign({
            header: title,
            confirmText: confirmText,
            cancelText: cancelText,
            onConfirm,
            onCancel
        }, props), DiscordModules.React.createElement(this.Text, null, content)));
    }

    static alert(title: string, content: any) {
        return this.showConfirmationModal(title, content, {cancelText: null});
    }
}