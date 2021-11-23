import {Webpack} from "../../modules";
import components from "../data/components";
import DiscordModules from '../../modules/discord';
import { createUpdateWrapper } from '../../modules/utilities';
import TextInput from "./textinput";
import AsyncComponent from "./asynccomponent";
import RadioGroup from "./radiogroup";
import Modal from "./modal";
import Category from './category';

let Components = {
    settings: {
        TextInput,
        RadioGroup,
        Category
    },
    AsyncComponent,
    modal: Modal,
};

(() => {
    const cache = new Map();

    for (const id in components) {
        const options = components[id];
        
        (options.settings ? Components.settings : Components)[id] = (props) => {
            if (!cache.has(id)) {
                const module = typeof (options.filter) === "function"
                    ? Webpack.findModule(options.filter)
                    : typeof (options.filter) === "string"
                        ? Webpack.findByDisplayName(options.filter)
                        : Array.isArray(options.filter)
                            ? Webpack.findByProps(options.filter)
                             : null;
                if (!module) return null;

                cache.set(id, createUpdateWrapper(module, void 0, void 0, options.valueProps));
            }

            const Component = cache.get(id);

            return DiscordModules.React.createElement(Component, props);
        }
    }

    Webpack.wait(() => {
        const Forms = Webpack.findByProps("FormItem");

        Object.assign(Components, Forms);
    });
})();

export default Components;