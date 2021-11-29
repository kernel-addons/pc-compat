import { Webpack } from "../../modules";
import components from "../data/components";
import {promise} from '../../modules/discord';
import {createUpdateWrapper} from "../../modules/utilities";

import TextInput from "./textinput";
import RadioGroup from "./radiogroup";
import Category from './category';
import Divider from "./divider"
import ColorPicker, {ColorPickerInput} from "./colorpicker";
import SliderInput from "./slider";

import AsyncComponent from "./asynccomponent";
import Modal from "./modal";
import * as Icons from "./icons/index"

let Components = {
    settings: {
        TextInput,
        RadioGroup,
        Category,
        ColorPickerInput,
        SliderInput
    },
    AsyncComponent,
    modal: Modal,
    Icons,
    ColorPicker,
    Divider
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

        Object.assign((options.settings ? Components.settings : Components),
            Array.isArray(options.prop)
                ? Object.fromEntries(options.prop.map(prop => [prop, component[prop]]))
                : {[id]: component}
        );
    }
});

export default Components;