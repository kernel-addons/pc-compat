import SettingsEntries from "../settings.json";
import Components from "@powercord/components";
import DataStore from "@modules/datastore";
import Modals from "@ui/modals";
import DiscordModules from "@modules/discord";

const boolToString = (bool: boolean) => bool ? "on" : "off";

const shake = () => {
    const {ComponentDispatch} = DiscordModules.ComponentDispatcher;

    ComponentDispatch.dispatch("SHAKE_APP", {duration: 500, intensity: 6});
};

export const defaultSettings = Object.entries(SettingsEntries).reduce((items, [id, item]) => {
    items[id] = item.value;

    return items;
}, {});

export function SettingsItem(props: any) {
    const {SwitchItem, TextInput} = Components.settings as any; 
    const [value, setValue] = React.useState(DataStore.tryLoadData("updater", defaultSettings)[props.id]);

    const handleChange = (value: any) => {
        if (props.type === "number") {
            setValue(Number(value));
        } else {
            setValue(value);
            handleSave();
        }
    };
    
    const handleSave = () => {
        let current = value;

        if (props.type === "number" && (Number.isNaN(Number(current)) || Number(current) < props.min)) {
            Modals.alert("Silly", "You put an invalid update fetch interval time. Don't do that.");
            shake();
    
            current = defaultSettings[props.id];
            setValue(() => current);
        } else if (props.type === "number") {
            current = Number(current);
        }
        
        DataStore.trySaveData("updater", {
            ...DataStore.tryLoadData("updater", defaultSettings),
            [props.id]: current
        }, true);
    };

    switch (props.type) {
        case "switch": return (
            <SwitchItem
                {...props}
                note={props.note + `[default=${boolToString(defaultSettings[props.id])}]`}
                value={value}
                onChange={handleChange}
            >{props.name}</SwitchItem>
        );

        case "number": return (
            <TextInput
                note={props.note + `[default=${defaultSettings[props.id]}]`}
                value={value}
                onChange={handleChange}
                onBlur={handleSave}
            >{props.name}</TextInput>
        );
    }
}

export default function SettingsPanel() {
    return (
        <React.Fragment>
            {Object.entries(SettingsEntries).map(([id, desc]) => (
                <SettingsItem key={id} id={id} {...desc} />
            ))}
        </React.Fragment>
    );
}
