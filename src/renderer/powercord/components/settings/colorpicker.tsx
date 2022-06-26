import DiscordModules, {promise} from "@modules/discord";
import {findInReactTree, wrapInHooks} from "../../util";
import {fromPromise} from "../asynccomponent";
import ErrorBoundary from "../errorboundary";
import LoggerModule from "@modules/logger";
import Webpack from "@modules/webpack";
import FormItem from "./formitem";

const ColorPicker = fromPromise(promise.then(async () => {
    const LazyColorPicker = await (async () => {
        try {
            const GuildSettingsRolesEditDisplay = Webpack.findByDisplayName("GuildSettingsRolesEditDisplay");
            if (!GuildSettingsRolesEditDisplay) throw "GuildSettingsRolesEditDisplay was not found!";

            const Content = wrapInHooks(() => new GuildSettingsRolesEditDisplay({ guild: { id: '' }, role: { id: '' } }))();
            const ColorPickerFormItem = findInReactTree(Content, r => r.type?.displayName === "ColorPickerFormItem");
            const ColorPicker = ColorPickerFormItem.type({ role: { id: '' } })

            const loader = findInReactTree(ColorPicker, r => r.props?.defaultColor).type;
            const lazy = await loader().props.children.type;
            const mdl = await (lazy._ctor ?? lazy._payload._result)();

            return mdl.default;
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