// @ts-nocheck

if (typeof (Array.prototype.at) !== "function") {
    Object.defineProperty(Array.prototype, "at", {
        value: function at(index) {
            return index < 0 ? this[this.length - Math.abs(index)] : this[index];
        },
        enumerable: false,
        configurable: true
    })
}

if (typeof (setImmediate) === "undefined") {
    window.setImmediate = (callback: any) => setTimeout(callback, 0);
}

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

export type ModuleFilter = (module: any, index: number) => boolean;

class WebpackModule {
    whenReady: Promise<void>;
    cache = null;
    #listeners = new Set();
    get Filters() {return Filters;}
    get chunkName() {return "webpackChunkdiscord_app";}
    get id() {return Symbol("pc-compat");}

    constructor() {
        this.whenReady = this.waitForGlobal.then(() => new Promise(async onReady => {
            const [Dispatcher, UserStore] = await this.findByProps(
                ["_dispatch", "dispatch"], ["getCurrentUser", "_dispatchToken"],
                {cache: false, bulk: true, wait: true, forever: true}
            );

            if (UserStore.getCurrentUser()) return onReady();

            const listener = function () {
                Dispatcher.unsubscribe("START_SESSION", listener);
                Dispatcher.unsubscribe("CONNECTION_OPEN", listener);
                onReady();
            };

            Dispatcher.subscribe("START_SESSION", listener);
            Dispatcher.subscribe("CONNECTION_OPEN", listener);
        }));

        this.whenReady.then(() => {
            let originalPush = window[this.chunkName].push;

            const handlePush = (chunk: any[]) => {
                const [, modules] = chunk;

                for (const moduleId in modules) {
                    const originalModule = modules[moduleId];

                    modules[moduleId] = (...args) => {
                        const [, exports] = args;
                        originalModule.apply(originalModule, args);

                        const listeners = [...this.#listeners];
                        for (let i = 0; i < listeners.length; i++) {
                            try {listeners[i](exports);}
                            catch (error) {
                                console.error("[Webpack]", "Could not fire callback listener:", error);
                            }
                        }
                    };

                    Object.assign(modules[moduleId], originalModule, {
                        toString: originalModule.toString.bind(originalModule),
                        __original: originalModule
                    });
                }

                return originalPush.apply(window[this.chunkName], [chunk]);
            };

            Object.defineProperty(window[this.chunkName], "push", {
                configurable: true,
                get: () => handlePush,
                set: (newPush) => {
                    originalPush = newPush;

                    // Object.defineProperty(window[this.chunkName], "push", {
                    //     value: handlePush,
                    //     configurable: true,
                    //     writable: true
                    // });
                }
            });
        });
    }

    addListener(listener: Function) {
        this.#listeners.add(listener);

        return () => {
            this.#listeners.delete(listener);
        };
    }

    removeListener(listener: Function) {
        return this.#listeners.delete(listener);
    }

    findLazy(filter: Function): Promise<any> {
        const fromCache = this.findModule(filter);
        if (fromCache) return Promise.resolve(fromCache);

        return new Promise(resolve => {
            const listener = (m: any) => {
                const directMatch = filter(m);
                if (directMatch) {
                    resolve(m);
                    return void remove();
                }

                if (!m.default) return;
                const defaultMatch = filter(m.default);
                if (!defaultMatch) return;

                resolve(m.default);
                remove();
            };

            const remove = this.addListener(listener);
        });
    }

    async waitFor(filter: ModuleFilter, {retries = 100, all = false, forever = false, delay = 50} = {}) {
        for (let i = 0; (i < retries) || forever; i++) {
            const module = this.findModule(filter, {all, cache: false});
            if (module) return module;
            await new Promise(res => setTimeout(res, delay));
        }
    }

    parseOptions(args, filter = thing => (typeof (thing) === "object" && thing != null && !Array.isArray(thing))) {
        return [args, filter(args.at(-1)) ? args.pop() : {}];
    }

    request(cache = true) {
        if (this.cache) return this.cache;

        if (Array.isArray(window[this.chunkName])) {
            const chunk = [[this.id], {}, __webpack_require__ => __webpack_require__];
            this.cache = window[this.chunkName].push(chunk);
            window[this.chunkName].splice(window[this.chunkName].indexOf(chunk), 1);
        }

        return this.cache;
    }

    findModule(filter: ModuleFilter, {all = false, cache = true, force = false, default: defaultExports = false} = {}) {
        if (typeof (filter) !== "function") return void 0;

        const __webpack_require__ = this.request(cache);
        const found = [];
        let hasError = null;

        if (!__webpack_require__) return;

        const wrapFilter = function (module: any, index: number) {
            try {return filter(module, index);}
            catch (error) {
                hasError ??= error;
                return false;
            }
        };

        for (const id in __webpack_require__.c) {
            const module = __webpack_require__.c[id].exports;
            if (!module || module === window) continue;

            switch (typeof module) {
                case "object": {
                    if (wrapFilter(module, id)) {
                        if (!all) return module;
                        found.push(module);
                    }

                    if (module.__esModule &&
                        module.default != null &&
                        typeof module.default !== "number" &&
                        wrapFilter(module.default, id)
                    ) {
                        const exports = defaultExports ? module : module.default;
                        if (!all) return exports;
                        found.push(exports);
                    }

                    if (force && module.__esModule) for (const key in module) {
                        if (!module[key]) continue;

                        if (wrapFilter(module[key], id)) {
                            if (!all) return module[key];
                            found.push(module[key]);
                        }
                    }

                    break;
                }

                case "function": {
                    if (wrapFilter(module, id)) {
                        if (!all) return module;
                        found.push(module);
                    }

                    break;
                }
            }
        }

        if (hasError) {
            setImmediate(() => {
                console.warn("[Webpack] filter threw an error. This can cause lag spikes at the user's end. Please fix asap.\n\n", hasError);
            });
        }

        return all ? found : found[0];
    }

    findModules(filter: ModuleFilter) {return this.findModule(filter, {all: true});}

    bulk(...options: any[]) {
        const [filters, {wait = false, ...rest}] = this.parseOptions(options);
        const found = new Array(filters.length);
        const searchFunction = wait ? this.waitFor : this.findModule;
        const wrappedFilters = filters.map(filter => {
            if (Array.isArray(filter)) filter = Filters.byProps(...filter);
            if (typeof (filter) === "string") filter = Filters.byDisplayName(filter);

            return (m) => {
                try {return filter(m);}
                catch (error) {return false;}
            };
        });

        const returnValue = searchFunction.call(this, (module: any) => {
            for (let i = 0; i < wrappedFilters.length; i++) {
                const filter = wrappedFilters[i];
                if (typeof filter !== "function" || !filter(module) || found[i] != null) continue;

                found[i] = module;

            }

            return found.filter(String).length === filters.length;
        }, rest);

        if (wait) return returnValue.then(() => found);

        return found;
    }

    findByProps(...options: any[]) {
        const [props, {bulk = false, wait = false, ...rest}] = this.parseOptions(options);

        if (!bulk && !wait) {
            return this.findModule(Filters.byProps(...props), rest);
        }

        if (wait && !bulk) {
            return this.waitFor(Filters.byProps(...props), rest);
        }

        if (bulk) {
            const filters = props.map((propsArray: string[]) => Filters.byProps(...propsArray)).concat({wait, ...rest});

            return this.bulk(...filters);
        }


        return null;
    }

    findByDisplayName(...options: any[]) {
        const [displayNames, {bulk = false, wait = false, ...rest}] = this.parseOptions(options);

        if (!bulk && !wait) {
            return this.findModule(Filters.byDisplayName(displayNames[0]), rest);
        }

        if (wait && !bulk) {
            return this.waitFor(Filters.byDisplayName(displayNames[0]), rest);
        }

        if (bulk) {
            const filters = displayNames.map(filters.map(Filters.byDisplayName)).concat({wait, cache});

            return this.bulk(...filters);
        }

        return null;
    }

    findIndex(filter: ModuleFilter) {
        let foundIndex = -1;

        this.findModule((module, index) => {
            if (filter(module)) foundIndex = index;
        });

        return foundIndex;
    }

    atIndex(index: number) {
        return this.request(true)?.c[index];
    }

    get waitForGlobal() {
        return new Promise<void>(async onExists => {
            while (!Array.isArray(window[this.chunkName])) {
                await new Promise(setImmediate);
            }

            onExists();
        });
    }

    /**@deprecated Use Webpack.whenReady.then(() => {}) instead. */
    async wait(callback = null) {
        return this.whenReady.then(() => {
            typeof callback === "function" && callback();
        });
    }

    /**@deprecated Use Webpack.whenReady.then(() => {}) instead. */
    get whenExists() {return this.waitForGlobal;}

    /**@deprecated Use Webpack.whenReady.then(() => {}) instead. */
    on(event: string, listener: Function) {
        switch (event) {
            case "LOADED": return this.whenReady.then(listener);
        }
    }

    /**@deprecated @see Webpack.on */
    get once() {return this.on;}
}

const Webpack = new WebpackModule;

export default Webpack;
