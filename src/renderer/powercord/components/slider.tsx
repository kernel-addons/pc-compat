import DiscordModules, {promise} from "../../modules/discord";
import {fromPromise} from "./asynccomponent";
import FormItem from './formitem';

const SliderInput = fromPromise(promise.then(() => {
    const {Slider} = DiscordModules;

    return function SliderInput(props) {
        const { children: title, note, required } = props
        delete props.children;

        return (
            <FormItem title={title} note={note} required={required}>
                <Slider
                    {...Object.assign({},  props, {
                        className: [props.className, "pc-margin-top-20"].filter(n => n).join(" ")
                    })}
                />
            </FormItem>
        );
    };
}));

export default SliderInput;