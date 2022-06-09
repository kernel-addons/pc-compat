import DiscordModules, {promise} from "../../../modules/discord";
import {fromPromise} from "../asynccomponent";
import Divider from '../divider';

const FormItem = fromPromise(promise.then(() => {
    const {Forms, Flex, FormClasses, Margins} = DiscordModules;

    return function FormItem({title, required, children, note, noteHasMargin}) {
        const noteClasses = [FormClasses?.description, noteHasMargin && Margins?.marginTop8].filter(Boolean).join(" ");

        return <Forms.FormItem
            className={`${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP} ${Margins?.marginBottom20}`}
            required={required}
            title={title}
        >
            {children}
            {note && <Forms.FormText className={noteClasses}>{note}</Forms.FormText>}
            <Divider />
        </Forms.FormItem>
    };
}));

export default FormItem;