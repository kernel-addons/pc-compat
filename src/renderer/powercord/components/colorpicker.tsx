import {DiscordModules, Webpack} from "../../modules";
import Logger from "../../modules/logger";
import {findInReactTree} from "../util";
import {fromPromise} from "./asynccomponent";
import ErrorBoundary from "./errorboundary";

const ColorPicker = fromPromise(Webpack.whenReady.then(() => {
    try {
        const GuildFolderSettingsModal = Webpack.findByDisplayName("GuildFolderSettingsModal");
        if (!GuildFolderSettingsModal) throw "GuildFolderSettingsModal was not found!";
        const rendered = GuildFolderSettingsModal.prototype.render.call({state: {}, props: {}});
        const ColorPicker = findInReactTree(rendered, e => e?.props?.defaultColor != null).type;
        if (typeof(ColorPicker) !== "function") throw "ColorPicker could not be found!";

        return (props) => (
            <ErrorBoundary>
                <ColorPicker {...props} />
            </ErrorBoundary>
        );
    } catch (error) {
        Logger.error("Failed to get ColorPicker component!", error);
        return () => null;
    }
}));

export function ColorPickerInput(props) {
    const {Forms, Constants: {DEFAULT_ROLE_COLOR, ROLE_COLORS}} = DiscordModules;
    const {children: name, note, required, default: defaultValue, defaultColors = ROLE_COLORS, value, disabled, onChange} = props;

    return (
        <Forms.FormItem title={name} required={required} >
            <ColorPicker
                colors={defaultColors}
                defaultColor={typeof (defaultValue) === "number" ? defaultValue : DEFAULT_ROLE_COLOR}
                onChange={onChange}
                disabled={disabled}
                value={value}
            />
            {note && <Forms.FormText type="description">{note}</Forms.FormText>}
        </Forms.FormItem>
    );
} 

export default ColorPicker;