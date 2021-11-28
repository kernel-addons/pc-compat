import { Webpack } from "../../modules";
import components from "../data/components";
import DiscordModules from '../../modules/discord';
import { createUpdateWrapper } from '../../modules/utilities';

import TextInput from "./textinput";
import RadioGroup from "./radiogroup";
import Category from './category';

import AsyncComponent from "./asynccomponent";
import Modal from "./modal";
import * as Icons from "./icons/index"

let Components = {
    settings: {
        TextInput,
        RadioGroup,
        Category
    },
    AsyncComponent,
    modal: Modal,
    Icons
};

(() => {
    const cache = new Map();

    for (const id in components) {
        const options = components[id];

        (options.settings ? Components.settings : Components)[id] = (props) => {
            if (!cache.has(id)) {
                let mdl = typeof (options.filter) === "function"
                    ? Webpack.findModule(options.filter)
                    : typeof (options.filter) === "string"
                        ? Webpack.findByDisplayName(options.filter)
                        : Array.isArray(options.filter)
                            ? Webpack.findByProps(options.filter)
                            : null;
                if (!mdl) return null;

                if (options.prop && Array.isArray(options.prop)) {
                    const mdls = {};
                    options.prop.forEach(p => mdls[p] = mdl[p]);
                    mdl = mdls;
                } else if (options.prop && typeof options.prop == 'string') {
                    mdl = mdl[options.prop];
                }

                cache.set(id, createUpdateWrapper(mdl, void 0, void 0, options.valueProps));
            }

            const Component = cache.get(id);

            return DiscordModules.React.createElement(Component, props);
        };
    }
})();

export default Components;