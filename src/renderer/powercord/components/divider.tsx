import DiscordModules, {promise} from "../../modules/discord";
import {fromPromise} from "./asynccomponent";

export default fromPromise(promise.then(() => {
    const {Forms} = DiscordModules;

    return function Divider() {
        return (
            <Forms.FormDivider className="pc-settings-divider" />
        );
    }
}));