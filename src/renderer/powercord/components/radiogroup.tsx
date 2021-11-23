import {DiscordModules} from "../../modules";
import Components from "../../modules/components";

export default function RadioGroup({children, note, value, onChange, ...props}) {
    const {React, Forms} = DiscordModules;
    const RadioGroup = Components.get("RadioGroup");
    const [state, setValue] = React.useState(value);

    return (
        <Forms.FormItem title={children}>
            {note && <Forms.FormText type="description">{note}</Forms.FormText>}
            <RadioGroup
                {...props}
                value={state}
                onChange={({value}) => (setValue(value), onChange(value))}
            />
        </Forms.FormItem>
    );
};