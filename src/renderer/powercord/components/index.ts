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
import FormItem from './formitem';

import AsyncComponent from "./asynccomponent";
import Modal from "./modal";
import * as Icons from "./icons/index"

let Components = {
    settings: {
        TextInput,
        RadioGroup,
        Category,
        ColorPickerInput,
        SliderInput,
        FormItem
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

        let out;

        if (Array.isArray(options.prop)) {
            out = {};
            options.prop.map(p => Array.isArray(p) ? out[p[0]] = component[p[1]] : out[p] = component[p])
        } else if(typeof options.prop == 'string') {
            out = component[options.prop]
        } else {
            out = component;
        }

        Object.assign((options.settings ? Components.settings : Components), {[id]: out});
    }
});

export default Components;