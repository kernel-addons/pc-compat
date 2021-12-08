import {DiscordModules} from "../../../modules";
import FormItem from './formitem';

export default function TextInput(props) {
    const {TextInput} = DiscordModules;

    const {children: title, note, required} = props;
    delete props.children;

    return (
        <FormItem title={title} note={note} required={required} noteHasMargin>
            <TextInput {...props} required={required} />
        </FormItem>
    );
}