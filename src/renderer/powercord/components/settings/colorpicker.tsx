import {promise} from "@modules/discord";
import {DiscordModules, Webpack} from "../../../modules";
import LoggerModule from "../../../modules/logger";
import {findInReactTree, wrapInHooks} from "../../util";
import {fromPromise} from "../asynccomponent";
import ErrorBoundary from "../errorboundary";
import FormItem from "./formitem"

const Logger = LoggerModule.create("ColorPicker")

const ColorPicker = fromPromise(promise.then(() => {
    try {
        const GuildSettingsRolesEditDisplay = Webpack.findByDisplayName("GuildSettingsRolesEditDisplay");
        if (!GuildSettingsRolesEditDisplay) throw "GuildSettingsRolesEditDisplay was not found!";
        const rendered = wrapInHooks(() => new GuildSettingsRolesEditDisplay({ guild: { id: '' }, role: { id: '' } }))();
        const FormItem = findInReactTree(rendered, r => r.type?.displayName === "ColorPickerFormItem").type({ role: { id: "" } });
        const ColorPicker = findInReactTree(FormItem, r => r.props?.defaultColor).type;
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