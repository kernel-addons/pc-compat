import {DiscordModules} from "../../modules";
import FormItem from './formitem';

export default function TextInput(props) {
    const { children: title, note, required } = props;
    delete props.children;

    const {TextInput} = DiscordModules;


    return (
        <FormItem title={title} note={note} required={required} noteHasMargin>
            <TextInput {...props} />
        </FormItem>
    );
}