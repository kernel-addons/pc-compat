import SettingsEntries from "../settings.json";
import Components from "@powercord/components";
import DataStore from "@modules/datastore";

export const defaultSettings = Object.entries(SettingsEntries).reduce((items, [id, item]) => {
    items[id] = item.value;

    return items;
}, {});

export function SettingsItem(props: any) {
    const {SwitchItem, TextInput} = Components.settings as any; 
    const value = DataStore.useState(() => {
        return DataStore.tryLoadData("updater", defaultSettings)[props.id];
    });

    const handleChange = (value: any) => {
        if (typeof value === "string" && !Number.isNaN(Number(value))) {
            value = Number(value);
        }
        
        DataStore.trySaveData("updater", {
            ...DataStore.tryLoadData("updater", defaultSettings),
            [props.id]: value
        }, true);
    };

    switch (props.type) {
        case "switch": return (
            <SwitchItem
                {...props}
                value={value}
                onChange={handleChange}
            >{props.name}</SwitchItem>
        );

        case "text": return (
            <TextInput
                note={props.note}
                value={value}
                onChange={handleChange}
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