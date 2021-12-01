import {promise} from "@modules/discord";
import Webpack from "@modules/webpack"
import {fromPromise} from "./asynccomponent";

const Icon: any = fromPromise(promise.then(() => {
    const Icons = Webpack.findModules(m => typeof m === 'function' && m.toString().indexOf('"currentColor"') !== -1)

    function IconComponent(props) {
        const mdl = Icons.find(i => i.displayName === props.name);
        const Props = _.cloneDeep(props);
        delete Props.name;

        return React.createElement(mdl, Props);
    };

    Icon.Names = Icons.map(m => m.displayName);

    return IconComponent;
}));

export default Icon;