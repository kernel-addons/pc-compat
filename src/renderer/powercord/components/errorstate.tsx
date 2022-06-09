import DiscordModules, {promise} from "@modules/discord";
import {fromPromise} from "./asynccomponent";
import Webpack from "@modules/webpack";
import Icon from "./icon";

const ErrorState = fromPromise(promise.then(() => {
    const {Margins, Markdown} = DiscordModules;
    const {error, backgroundRed, icon, text} = Webpack.findByProps('error', 'backgroundRed') || {};
    if (!error || !backgroundRed || !icon || !text) return;

    return function ErrorState({children}) {
        return (
            <div className={`${error} ${backgroundRed} ${Margins?.marginBottom20}`}>
                <Icon className={icon} name='WarningCircle' />
                <div className={text}>
                    <Markdown>{children}</Markdown>
                </div>
            </div>
        );
    };
}));

export default ErrorState;