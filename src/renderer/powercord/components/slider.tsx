import DiscordModules, {promise} from "../../modules/discord";
import {fromPromise} from "./asynccomponent";

const SliderInput = fromPromise(promise.then(() => {
    const {Slider, Forms} = DiscordModules;

    return function SliderInput({children: name, note, required, ...props}) {
        return (
            <Forms.FormItem>
                <Slider
                    {...Object.assign({}, props, {
                        className: [props.className, "pc-margin-top-20"].filter(n => n).join(" ")
                    })}
                />
                {note && <Forms.FormText type="description">{note}</Forms.FormText>}
            </Forms.FormItem>
        );
    };
}));

export default SliderInput;