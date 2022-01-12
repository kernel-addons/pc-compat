import Webpack from "@modules/webpack";
import DiscordModules from "@modules/discord";
import LoggerModule from "@modules/logger";
import {findInReactTree} from "../../util";
import {fromPromise} from "../asynccomponent";
import ErrorBoundary from "../errorboundary";
import FormItem from "./formitem";

const ColorPicker = fromPromise(Webpack.whenReady.then(() => {
    const LazyColorPicker = Webpack.findByDisplayName("ColorPicker") ?? (() => {
        try {
            const GuildFolderSettingsModal = Webpack.findByDisplayName("GuildFolderSettingsModal");
            if (!GuildFolderSettingsModal) throw "GuildFolderSettingsModal was not found!";
            const rendered = GuildFolderSettingsModal.prototype.render.call({state: {}, props: {}});
            const ColorPicker = findInReactTree(rendered, e => e?.props?.defaultColor != null).type;
            if (typeof (ColorPicker) !== "function") throw "ColorPicker could not be found!";
    
            return ColorPicker;
        } catch (error) {
            LoggerModule.getLogger("Components")?.error("Failed to get ColorPicker component!", error);
            return () => null;
        }
    })();

    return (props) => (
        <ErrorBoundary>
            <LazyColorPicker {...props} />
        </ErrorBoundary>
    );
}));

export function ColorPickerInput(props) {
    const {Constants: {DEFAULT_ROLE_COLOR, ROLE_COLORS}} = DiscordModules;
    const {children: title, note, required, default: defaultValue, defaultColors = ROLE_COLORS, value, disabled, onChange} = props;
    delete props.children;

    return (
        <FormItem title={title} required={required} note={note}>
            <ColorPicker
                colors={defaultColors}
                defaultColor={typeof (defaultValue) === "number" ? defaultValue : DEFAULT_ROLE_COLOR}
                onChange={onChange}
                disabled={disabled}
                value={value}
            />
        </FormItem>
    );
}

export default ColorPicker;