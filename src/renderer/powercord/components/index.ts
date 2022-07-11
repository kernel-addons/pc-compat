import ColorPicker, {ColorPickerInput} from "./settings/colorpicker";
import {createUpdateWrapper} from "@modules/utilities";
import TextAreaInput from "./settings/textareainput";
import SelectInput from "./settings/selectinput";
import RadioGroup from "./settings/radiogroup";
import AsyncComponent from "./asynccomponent";
import TextInput from "./settings/textinput";
import SliderInput from "./settings/slider";
import components from "../data/components";
import Category from "./settings/category";
import FormItem from "./settings/formitem";
import Checkbox from "./settings/checkbox";
import {promise} from "@modules/discord";
import * as Icons from "./icons/index";
import Webpack from "@modules/webpack";
import Divider from "./divider"
import Modal from "./modal";
import Icon from "./icon";


let Components = {
    settings: {
        TextInput,
        RadioGroup,
        Category,
        ColorPickerInput,
        SliderInput,
        FormItem,
        SelectInput,
        Checkbox,
        TextAreaInput
    },
    Icon,
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

        let data = {};

        if (Array.isArray(options.prop)) {
            Object.assign(data, Object.fromEntries(options.prop.map(prop => [prop, component[prop]])));
        } else if (typeof (options.prop) === "string") {
            data = component[options.prop]
        }

        if (Array.isArray(options.rename)) {
            for (const {from, to} of options.rename) {
                data[to] = component[from];
            }
        }

        if (!Array.isArray(options.rename) && !options.prop) {
            data = component;
        }

        const target = options.settings ? Components.settings : Components;
        Object.assign(target, {[id]: data});
    }
});

export default Components;