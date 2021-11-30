import DiscordModules, {promise} from "../../modules/discord";
import {fromPromise} from "./asynccomponent";

const FormItem = fromPromise(promise.then(() => {
    const {Forms} = DiscordModules;

    return function FormItem({ ...props}) {
        return <Forms.FormItem {...props} />
    };
}));

export default FormItem;