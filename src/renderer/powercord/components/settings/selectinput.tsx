import {DiscordModules} from "../../../modules";
import FormItem from './formitem';

export default function SelectInput(props) {
    const {SelectInput} = DiscordModules;

    const {children: title, note, required} = props;
    delete props.children;

    return (
        <FormItem title={title} note={note} required={required} noteHasMargin>
            <SelectInput {...props} required={required} />
        </FormItem>
    );
}