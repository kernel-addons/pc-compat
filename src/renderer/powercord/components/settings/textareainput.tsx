import DiscordModules, {promise} from "../../../modules/discord";
import {fromPromise} from "../asynccomponent";
import FormItem from './formitem';

const TextAreaInput = fromPromise(promise.then(() => {
    const {TextArea} = DiscordModules;

    return function TextAreaInput(props) {
        const { children: title, note, required } = props
        delete props.children;

        return (
            <FormItem title={title} note={note} required={required}>
                <TextArea {...props} />
            </FormItem>
        );
    };
}));

export default TextAreaInput;