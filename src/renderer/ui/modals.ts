import memoize from "@modules/memoize";
import {createUpdateWrapper} from "@modules/utilities";
import TextInput from "@powercord/components/settings/textinput";
import DiscordModules from "../modules/discord";
import ChangeLog, {ChangeLogItems} from "./changelog";

export default class Modals {
    static get TextInput() {return memoize(this, "TextInput", createUpdateWrapper(TextInput));}

    static showConfirmationModal(title: string, content: any, options = {}) {
        const {confirmText = "Okay", cancelText = "Cancel", onConfirm = () => {}, onCancel = () => {}, danger = false} = options as any;
        const {ModalsApi, ConfirmationModal, React, Markdown, Button} = DiscordModules;

        return ModalsApi.openModal(props => {
            return React.createElement(ConfirmationModal, Object.assign({
                header: title,
                confirmText: confirmText,
                cancelText: cancelText,
                onConfirm,
                onCancel,
                confirmButtonColor: danger ? Button.Colors.RED : Button.Colors.BRAND
            }, props),
                typeof (content) === "string" ? React.createElement(Markdown, null, content) : content
            )
        });
    }

    static prompt(title: string, content: any, options: any = {}) {
        const {placeholder = "", onInput = () => {}} = options as any;
        let value = "";

        return this.showConfirmationModal(title, React.createElement(this.TextInput, {
            note: content,
            value: value,
            placeholder: placeholder,
            onChange: (val: string) => {
                value = val;
            }
        }), {
            onConfirm: () => {
                onInput(value);
            }
        });
    }

    static alert(title: string, content: any) {
        return this.showConfirmationModal(title, content, {cancelText: null});
    }

    static showChangeLog(title: string, items: ChangeLogItems) {
        const {ModalsApi} = DiscordModules;

        return ModalsApi.openModal(props => {
            return React.createElement(ChangeLog, Object.assign({title, items}, props))
        });
    }
}