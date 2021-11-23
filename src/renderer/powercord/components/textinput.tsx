import {DiscordModules} from "../../modules";

export default function TextInput({children, note, ...rest}) {
    const {React, TextInput, Forms} = DiscordModules;
    
    return (
        <Forms.FormItem title={children}>
            <TextInput {...rest} />
            {note && <Forms.FormText type="description">{note}</Forms.FormText>}
        </Forms.FormItem>
    );
}