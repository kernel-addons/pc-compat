// @ts-nocheck

if (typeof (Array.prototype.at) !== "function") {
    Array.prototype.at = function (index) {
        return index < 0 ? this[this.length - Math.abs(index)] : this[index];
    };
}

if (typeof (setImmediate) === "undefined") {
    window.setImmediate = (callback) => setTimeout(callback, 0);
}

export const Events = {
    CREATE: "CREATE",
    LENGTH_CHANGE: "LENGTH_CHANGE",
    PUSH: "PUSH",
    LOADED: "LOADED"
};

export class Filters {
    static byProps(...props: string[]) {
        return (module: any) => props.every(prop => prop in module);
    }

    static byDisplayName(name: string, def = false) {
        return (module: any) => (def ? (module = module.default) : module) && typeof (module) === "function" && module.displayName === name;
    }

    static byTypeString(...strings: string[]) {
        return (module: any) => module.type && (module = module.type?.toString()) && strings.every(str => module.indexOf(str) > -1);
    }
}

export class WebpackModule {
    whenReady = null;
    #events = Object.fromEntries(Object.keys(Events).map(key => [key, new Set()]));
    #cache = null;
    get Events() {return Events;}
    get chunkName() {return "webpackChunkdiscord_app";}
    get id() {return "kernel-req" + Math.random().toString().slice(2, 5)};

    constructor() {
        Object.defineProperty(window, this.chunkName, {
            get() {return void 0;},
            set: (value) => {
                setImmediate(() => {
                    this.dispatch(Events.CREATE);
                });

                const originalPush = value.push;
                value.push = (...values) => {
                    this.dispatch(Events.LENGTH_CHANGE, value.length + values.length);
                    this.dispatch(Events.PUSH, values);

                    return Reflect.apply(originalPush, value, values);
                };

                Object.defineProperty(window, this.chunkName, {
                    value,
                    configurable: true,
                    writable: true
                });
                return value;
            },
            configurable: true
        });

        let listener = (shouldUnsubscribe, Dispatcher, ActionTypes, event) => {
            if (shouldUnsubscribe) {
                Dispatcher.unsubscribe(ActionTypes.START_SESSION, listener);
            }

            this.dispatch(Events.LOADED);
        };


        this.once(Events.PUSH, async () => {
            const [Dispatcher, Constants] = await this.findByProps(
                ["dirtyDispatch"], ["API_HOST", "ActionTypes"],
                {cache: false, bulk: true, wait: true}
            );

            Dispatcher.subscribe(Constants.ActionTypes.START_SESSION, listener = listener.bind(null, true, Dispatcher, Constants.ActionTypes));
        });
    }

    dispatch(event, ...args) {
        if (!(event in this.#events)) throw new Error(`Unknown Event: ${event}`);

        for (const callback of this.#events[event]) {
            try {callback(...args);}
            catch (err) {console.error(err);}
        }
    }

    on(event, callback) {
        if (!(event in this.#events)) throw new Error(`Unknown Event: ${event}`);

        return this.#events[event].add(callback), () => this.off(event, callback);
    }

    off(event, callback) {
        if (!(event in this.#events)) throw new Error(`Unknown Event: ${event}`);

        return this.#events[event].delete(callback);
    }

    once(event, callback) {
        const unlisten = this.on(event, (...args) => {
            unlisten();
            callback(...args);
        });
    }

    async waitFor(filter, {retries = 100, all = false, delay = 50} = {}) {
        for (let i = 0; i < retries; i++) {
            const module = this.findModule(filter, {all, cache: false});
            if (module) return module;
            await new Promise(res => setTimeout(res, delay));
        }
    }

    #parseOptions(args, filter = thing => (typeof (thing) === "object" && thing != null && !Array.isArray(thing))) {
        return [args, filter(args.at(-1)) ? args.pop() : {}];
    }

    request(cache = true) {
        if (cache && this.#cache) return this.#cache;
        let req = void 0;

        if ("webpackChunkdiscord_app" in window && webpackChunkdiscord_app != null) {
            const chunk = [[this.id], {}, __webpack_require__ => req = __webpack_require__];
            webpackChunkdiscord_app.push(chunk);
            webpackChunkdiscord_app.splice(webpackChunkdiscord_app.indexOf(chunk), 1);
        }

        this.#cache = req;
        return req;
    }

    findModule(filter, {all = false, cache = true, force = false} = {}) {
        if (typeof (filter) !== "function") return void 0;

        const __webpack_require__ = this.request(cache);
        const found = [];

        if (!__webpack_require__.c) return null;

        const wrapFilter = function (module) {
            try {return filter(module);}
            catch {return false;}
        };

        for (const id in __webpack_require__.c) {
            var module = __webpack_require__.c[id].exports;
            if (!module || module === window) continue;
            
            switch (typeof module) {
                case "object": {
                    if (wrapFilter(module)) {
                        if (!all) return module;
                        found.push(module);
                    }

                    if (module.__esModule && module.default != null && wrapFilter(module.default)) {
                        if (!all) return module.default;
                        found.push(module.default);
                    }

                    if (force && module.__esModule) for (const key in module) {
                        if (!module[key]) continue;

                        if (wrapFilter(module[key])) {
                            if (!all) return module[key];
                            found.push(module[key]);
                        }
                    }
                
                    break;
                }

                case "function": {
                    if (wrapFilter(module)) {
                        if (!all) return module;
                        found.push(module);
                    }

                    break;
                }
            }
        }
        
        return all ? found : found[0];
    }

    findModules(filter) {return this.findModule(filter, {all: true});}

    bulk(...options) {
        const [filters, {wait = false, ...rest}] = this.#parseOptions(options);
        const found = new Array(filters.length);
        const searchFunction = wait ? this.waitFor : this.findModule;

        const returnValue = searchFunction.call(this, module => {
            const matches = filters.filter(filter => {
                try {return filter(module);}
                catch {return false;}
            });

            if (!matches.length) return false;

            for (const filter of matches) {
                found[filters.indexOf(filter)] = module;
            }

            return found.filter(Boolean).length === filters.length;
        }, rest);

        if (wait) return returnValue.then(() => found);

        return found;
    }

    findByProps(...options) {
        const [props, {bulk = false, wait = false, ...rest}] = this.#parseOptions(options);
        const filter = (props, module) => module && props.every(prop => prop in module);

        return bulk
            ? this.bulk(...props.map(props => filter.bind(null, props)).concat({wait, ...rest}))
            : wait
                ? this.waitFor(filter.bind(null, props))
                : this.findModule(filter.bind(null, props), rest);
    }

    findByDisplayName(...options) {
        const [displayNames, {bulk = false, default: defaultExport = false, wait = false, ...rest}] = this.#parseOptions(options);

        const filter = (name, module) => defaultExport
            ? module?.default?.displayName === name
            : module?.displayName === name;

        return bulk
            ? this.bulk(...displayNames.map(name => filter.bind(null, name)).concat({wait, cache}))
            : wait
                ? this.waitFor(filter.bind(null, displayNames[0]), rest)
                : this.findModule(filter.bind(null, displayNames[0]), rest);
    }

    async wait(callback = null) {
        return new Promise(resolve => {
            this.once(Events.LOADED, () => {
                resolve();
                typeof (callback) === "function" && callback();
            });
        });
    }

    get whenExists() {
        return new Promise(resolve => {
            this.once(Events.CREATE, resolve);
        });
    }
}

const Webpack: WebpackModule = window.Webpack ?? (window.Webpack = new WebpackModule);
if (!Webpack.whenReady) Webpack.whenReady = Webpack.wait();
export default Webpack;