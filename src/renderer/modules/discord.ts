import memoize from "./memoize.js";
import Webpack from "./webpack.js";

export default class DiscordModules {
    static get React(): typeof import("react") {return memoize(this, "React", () => Webpack.findByProps("createElement", "createContext"));}

    static get ReactDOM(): typeof import("react-dom") {return memoize(this, "ReactDOM", () => Webpack.findByProps("findDOMNode", "render", "createPortal"));}

    static get Flux() {
        return memoize(this, "Flux", () => 
            Webpack.findByProps(["Store", "Dispatcher"], ["connectStores"], {bulk: true})
                .reduce((modules: any, module: any) => Object.assign(modules, module), {})
        );
    }

    static get Dispatcher() {return memoize(this, "Dispatcher", () => Webpack.findByProps("dirtyDispatch"));}

    static get TextInput() {return memoize(this, "TextInput", () => Webpack.findByDisplayName("TextInput"));}

    static get Forms() {return memoize(this, "Forms", () => Webpack.findByProps("FormItem"));}

    static get ContextMenuActions() {return memoize(this, "ContextMenuActions", () => Webpack.findByProps("openContextMenu"));}
}