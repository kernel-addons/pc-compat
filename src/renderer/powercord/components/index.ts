import { Webpack } from "../../modules";
import components from "../data/components";
import DiscordModules, {promise} from '../../modules/discord';
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

promise.then(async () => {
    for (const id in components) {
        const options = components[id];

        let component: any = (() => {
            if (typeof (options.filter) === "function") {
                return Webpack.findModule(options.filter);
            }

            if (typeof (options.filter) === "string") {
                return Webpack.findByDisplayName(options.filter);
            }

            if (Array.isArray(options.filter)) {
                return Webpack.findByProps(...options.filter);
            }
        })();

        if (options.updater) {
            const temp = component;
            component = createUpdateWrapper(component, void 0, void 0, options.valueProps);
            Object.assign(component, temp);
        }

        if (options.settings) {
            Components.settings[id] = component;   
        } else {
            Components[id] = component;
        }
    }
});

export default Components;