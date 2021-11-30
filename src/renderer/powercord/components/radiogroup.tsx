import {DiscordModules} from "../../modules";
import Components from "../../modules/components";

export default function RadioGroup({children: title, note, required, ...props}) {
    const {React, Forms} = DiscordModules;
    const RadioGroup = Components.get("RadioGroup");

    return (
        <Forms.FormItem title={title} required={required}>
            {note && <Forms.FormText type="description">{note}</Forms.FormText>}
            <RadioGroup {...props} />
        </Forms.FormItem>
    );
};