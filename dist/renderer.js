const FONTAWESOME_BASEURL = "https://kit-pro.fontawesome.com/releases/v5.15.2/css/pro.min.css";
const MONACO_BASEURL = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min";

var Modules = {
    // React, Modules & Constants
    Constants: {
        props: [
            "API_HOST",
            "ActionTypes"
        ]
    },
    React: {
        props: [
            "createElement",
            "isValidElement"
        ]
    },
    ReactDOM: {
        props: [
            "render",
            "createPortal"
        ]
    },
    ReactSpring: {
        props: [
            "useSpring",
            "Controller",
            "animated"
        ]
    },
    Flux: {
        type: "MERGE",
        props: [
            [
                "Store",
                "Dispatcher"
            ],
            [
                "connectStores"
            ]
        ]
    },
    Dispatcher: {
        props: [
            "dirtyDispatch"
        ]
    },
    ContextMenuActions: {
        props: [
            "openContextMenu"
        ]
    },
    ModalsApi: {
        props: [
            "openModal",
            "useModalsStore"
        ]
    },
    ModalStack: {
        props: [
            "push",
            "popAll"
        ]
    },
    LocaleManager: {
        props: [
            "Messages",
            "getAvailableLocales"
        ],
        ensure: (mod)=>mod.Messages.CLOSE
    },
    LocaleStore: {
        props: [
            "locale",
            "theme"
        ]
    },
    Lodash: {
        props: [
            "zipObjectDeep"
        ]
    },
    MessageCreators: {
        props: [
            "createBotMessage"
        ]
    },
    MessageActions: {
        props: [
            "receiveMessage"
        ]
    },
    AvatarDefaults: {
        props: [
            "BOT_AVATARS"
        ]
    },
    // Stores
    SelectedChannelStore: {
        props: [
            "_dispatchToken",
            "getChannelId",
            "getLastSelectedChannelId"
        ]
    },
    // Components
    ModalComponents: {
        props: [
            "ModalRoot",
            "ModalHeader"
        ]
    },
    Switch: {
        name: "Switch"
    },
    SwitchItem: {
        name: "SwitchItem"
    },
    TextInput: {
        name: "TextInput"
    },
    SelectInput: {
        name: "SelectTempWrapper"
    },
    Tooltips: {
        props: [
            "TooltipContainer"
        ],
        rename: [
            {
                from: "default",
                to: "Tooltip"
            },
            {
                from: "TooltipContainer",
                to: "Container"
            },
            {
                from: "TooltipColors",
                to: "Colors"
            },
            {
                from: "TooltipPositions",
                to: "Positions"
            },
            {
                from: "TooltipLayer",
                to: "Layer"
            }, 
        ]
    },
    Button: {
        props: [
            "BorderColors",
            "Colors"
        ]
    },
    Slider: {
        name: "Slider"
    },
    ConfirmationModal: {
        name: "ConfirmModal"
    },
    Text: {
        name: "Text"
    },
    Markdown: {
        name: "Markdown",
        props: [
            "rules"
        ]
    },
    Caret: {
        name: "Caret"
    },
    Forms: {
        props: [
            "FormItem",
            "FormTitle"
        ]
    },
    Flex: {
        name: "Flex"
    },
    SearchBar: {
        name: "SearchBar"
    },
    Spinner: {
        name: "Spinner"
    },
    Scrollers: {
        props: [
            "ScrollerAuto",
            "ScrollerThin",
            "default"
        ]
    },
    // Classes
    Margins: {
        props: [
            "marginXLarge"
        ]
    },
    FormClasses: {
        props: [
            "formText",
            "description"
        ]
    },
    // ContextMenu
    ContextMenu: {
        type: "MERGE",
        props: [
            [
                "openContextMenu"
            ],
            [
                "MenuItem",
                "MenuControlItem"
            ]
        ],
        rename: [
            {
                from: "default",
                to: "Menu"
            },
            {
                from: "MenuItem",
                to: "Item"
            },
            {
                from: "MenuGroup",
                to: "Group"
            },
            {
                from: "MenuCheckboxItem",
                to: "CheckboxItem"
            },
            {
                from: "MenuSeparator",
                to: "Separator"
            },
            {
                from: "MenuCheckboxItem",
                to: "CheckboxItem"
            },
            {
                from: "MenuRadioItem",
                to: "RadioItem"
            },
            {
                from: "MenuStyle",
                to: "Style"
            },
            {
                from: "MenuControlItem",
                to: "ControlItem"
            },
            {
                from: "openContextMenu",
                to: "open"
            },
            {
                from: "closeContextMenu",
                to: "close"
            }, 
        ]
    },
    PlaceholderClasses: {
        props: [
            "emptyStateImage",
            "emptyStateSubtext"
        ]
    }
};

// @ts-nocheck
if (typeof Array.prototype.at !== "function") {
    Array.prototype.at = function(index) {
        return index < 0 ? this[this.length - Math.abs(index)] : this[index];
    };
}
if (typeof setImmediate === "undefined") {
    window.setImmediate = (callback)=>setTimeout(callback, 0)
    ;
}
class Filters {
    static byProps(...props) {
        return (module)=>props.every((prop)=>prop in module
            )
        ;
    }
    static byDisplayName(name, def = false) {
        return (module)=>(def ? module = module.default : module) && typeof module === "function" && module.displayName === name
        ;
    }
    static byTypeString(...strings) {
        return (module)=>{
            var ref;
            return module.type && (module = (ref = module.type) === null || ref === void 0 ? void 0 : ref.toString()) && strings.every((str)=>module.indexOf(str) > -1
            );
        };
    }
}
var Webpack = new class Webpack {
    get Filters() {
        return Filters;
    }
    get chunkName() {
        return "webpackChunkdiscord_app";
    }
    get id() {
        return "kernel-req" + Math.random().toString().slice(2, 5);
    }
    async waitFor(filter, { retries =100 , all =false , forever =false , delay =50  } = {
    }) {
        for(let i = 0; i < retries || forever; i++){
            const module = this.findModule(filter, {
                all,
                cache: false
            });
            if (module) return module;
            await new Promise((res)=>setTimeout(res, delay)
            );
        }
    }
    parseOptions(args, filter = (thing)=>typeof thing === "object" && thing != null && !Array.isArray(thing)
    ) {
        return [
            args,
            filter(args.at(-1)) ? args.pop() : {
            }
        ];
    }
    request(cache = true) {
        if (cache && this.cache) return this.cache;
        let req = undefined;
        if (Array.isArray(window[this.chunkName])) {
            const chunk = [
                [
                    this.id
                ],
                {
                },
                (__webpack_require__)=>req = __webpack_require__
            ];
            webpackChunkdiscord_app.push(chunk);
            webpackChunkdiscord_app.splice(webpackChunkdiscord_app.indexOf(chunk), 1);
        }
        if (!req) console.warn("[Webpack] Got empty cache.");
        if (cache) this.cache = req;
        return req;
    }
    findModule(filter, { all =false , cache =true , force =false  } = {
    }) {
        if (typeof filter !== "function") return void 0;
        const __webpack_require__ = this.request(cache);
        const found = [];
        if (!__webpack_require__) return;
        const wrapFilter = function(module, index) {
            try {
                return filter(module, index);
            } catch (e) {
                return false;
            }
        };
        for(const id in __webpack_require__.c){
            const module = __webpack_require__.c[id].exports;
            if (!module || module === window) continue;
            switch(typeof module){
                case "object":
                    {
                        if (wrapFilter(module, id)) {
                            if (!all) return module;
                            found.push(module);
                        }
                        if (module.__esModule && module.default != null && wrapFilter(module.default, id)) {
                            if (!all) return module.default;
                            found.push(module.default);
                        }
                        if (force && module.__esModule) for(const key in module){
                            if (!module[key]) continue;
                            if (wrapFilter(module[key], id)) {
                                if (!all) return module[key];
                                found.push(module[key]);
                            }
                        }
                        break;
                    }
                case "function":
                    {
                        if (wrapFilter(module, id)) {
                            if (!all) return module;
                            found.push(module);
                        }
                        break;
                    }
            }
        }
        return all ? found : found[0];
    }
    findModules(filter) {
        return this.findModule(filter, {
            all: true
        });
    }
    bulk(...options) {
        const [filters, { wait =false , ...rest }] = this.parseOptions(options);
        const found = new Array(filters.length);
        const searchFunction = wait ? this.waitFor : this.findModule;
        const wrappedFilters = filters.map((filter)=>(m)=>{
                try {
                    return filter(m);
                } catch (error) {
                    return false;
                }
            }
        );
        const returnValue = searchFunction.call(this, (module)=>{
            for(let i = 0; i < wrappedFilters.length; i++){
                const filter = wrappedFilters[i];
                if (typeof filter !== "function" || !filter(module) || found[i] != null) continue;
                found[i] = module;
            }
            return found.filter(String).length === filters.length;
        }, rest);
        if (wait) return returnValue.then(()=>found
        );
        return found;
    }
    findByProps(...options) {
        const [props, { bulk =false , wait =false , ...rest }] = this.parseOptions(options);
        if (!bulk && !wait) {
            return this.findModule(Filters.byProps(...props), rest);
        }
        if (wait && !bulk) {
            return this.waitFor(Filters.byProps(...props), rest);
        }
        if (bulk) {
            const filters = props.map((propsArray)=>Filters.byProps(...propsArray)
            ).concat({
                wait,
                ...rest
            });
            return this.bulk(...filters);
        }
        return null;
    }
    findByDisplayName(...options) {
        const [displayNames, { bulk =false , default: defaultExport = false , wait =false , ...rest }] = this.parseOptions(options);
        if (!bulk && !wait) {
            return this.findModule(Filters.byDisplayName(displayNames[0]), rest);
        }
        if (wait && !bulk) {
            return this.waitFor(Filters.byDisplayName(displayNames[0]), rest);
        }
        if (bulk) {
            const filters = displayNames.map(filters.map(Filters.byDisplayName)).concat({
                wait,
                cache
            });
            return this.bulk(...filters);
        }
        return null;
    }
    findIndex(filter) {
        let foundIndex = -1;
        this.findModule((module, index)=>{
            if (filter(module)) foundIndex = index;
        });
        return foundIndex;
    }
    atIndex(index) {
        var ref;
        return (ref = this.request(true)) === null || ref === void 0 ? void 0 : ref.c[index];
    }
    get waitForGlobal() {
        return new Promise(async (onExists)=>{
            while(!Array.isArray(window[this.chunkName])){
                await new Promise(setImmediate);
            }
            onExists();
        });
    }
    /**@deprecated Use Webpack.whenReady.then(() => {}) instead. */ async wait(callback = null) {
        return this.whenReady.then(()=>{
            typeof callback === "function" && callback();
        });
    }
    /**@deprecated Use Webpack.whenReady.then(() => {}) instead. */ get whenExists() {
        return this.waitForGlobal;
    }
    /**@deprecated Use Webpack.whenReady.then(() => {}) instead. */ on(event, listener) {
        switch(event){
            case "LOADED":
                return this.whenReady.then(listener);
        }
    }
    /**@deprecated @see Webpack.on */ get once() {
        return this.on;
    }
    constructor(){
        this.cache = null;
        this.whenReady = this.waitForGlobal.then(()=>new Promise(async (onReady)=>{
                const [Dispatcher, { ActionTypes  } = {
                }] = await this.findByProps([
                    "dirtyDispatch"
                ], [
                    "API_HOST",
                    "ActionTypes"
                ], {
                    cache: false,
                    bulk: true,
                    wait: true,
                    forever: true
                });
                const listener = function() {
                    Dispatcher.unsubscribe(ActionTypes.START_SESSION, listener);
                    onReady();
                };
                Dispatcher.subscribe(ActionTypes.START_SESSION, listener);
            })
        );
        window.Webpack = this;
    }
};

const DiscordModules = {
};
const NOOP_RET = (_)=>_
;
const filters = new Promise((resolve)=>{
    const result = [];
    for(let moduleId in Modules){
        const module = Modules[moduleId];
        let filter = NOOP_RET, map = null;
        if (Array.isArray(module.props)) {
            switch(module.type){
                case "MERGE":
                    {
                        let found = [];
                        filter = (m)=>{
                            const matches = module.props.some((props)=>props.every((prop)=>prop in m
                                )
                            );
                            if (matches) found.push(m);
                            return matches;
                        };
                        map = ()=>{
                            return Object.assign({
                            }, ...found);
                        };
                        break;
                    }
                default:
                    {
                        filter = (m)=>module.props.every((prop)=>prop in m
                            )
                        ;
                    }
            }
        }
        if (module.rename) {
            const current = map !== null && map !== void 0 ? map : NOOP_RET;
            map = (mod)=>{
                mod = current(mod);
                const cloned = {
                    ...mod
                };
                for (const { from , to  } of module.rename){
                    cloned[to] = mod[from];
                    delete cloned[from];
                }
                return cloned;
            };
        }
        if (module.name) {
            const current = filter;
            filter = (mod)=>mod.displayName === module.name && current(mod)
            ;
        }
        if (typeof module.ensure === "function") {
            const current = filter;
            filter = (mod)=>current(mod) && module.ensure(mod)
            ;
        }
        if (typeof filter !== "function") continue;
        result.push({
            filter,
            map,
            id: moduleId
        });
    }
    resolve(result);
});
const promise = Promise.all([
    filters,
    Webpack.whenReady
]).then(([filters1])=>{
    const result = Webpack.bulk(...filters1.map(({ filter  })=>filter
    ));
    Object.assign(DiscordModules, filters1.reduce((modules, { id , map  }, index)=>{
        const mapper = map !== null && map !== void 0 ? map : NOOP_RET;
        modules[id] = mapper(result[index]);
        return modules;
    }, {
    }));
});

function sleep$1(time) {
    return new Promise((resolve)=>setTimeout(resolve, time)
    );
}
function random(length = 10) {
    return Math.random().toString(36).slice(2, length + 2);
}
function getProps(obj, path) {
    if (!path) return obj;
    return path.split(".").reduce((value, key)=>value && value[key]
    , obj);
}
function setProps(object, path, value) {
    if (!path) return object;
    const split = path.split(".");
    const prop = split.pop();
    let current = split.length ? getProps(object, split.join(".")) : object;
    if (!current) return object;
    current[prop] = value;
    return object;
}
const createUpdateWrapper = (Component, valueProp = "value", changeProp = "onChange", valueProps = "0", valueIndex = 0)=>(props)=>{
        const [value1, setValue] = DiscordModules.React.useState(props[valueProp]);
        return DiscordModules.React.createElement(Component, {
            ...props,
            [valueProp]: value1,
            [changeProp]: (...args)=>{
                const value = getProps(args, valueProps);
                if (typeof props[changeProp] === "function") props[changeProp](args[valueIndex]);
                setValue(value);
            }
        });
    }
;
function omit(thing, ...things) {
    if (Array.isArray(thing)) {
        return thing.reduce((clone, key)=>things.includes(key) ? clone : clone.concat(key)
        , []);
    }
    const clone1 = {
    };
    for(const key1 in thing){
        if (things.includes(key1)) continue;
        clone1[key1] = thing[key1];
    }
    return clone1;
}
function joinClassNames(...classNames) {
    let className = [];
    for (const item of classNames){
        if (typeof item === "string") {
            className.push(item);
            continue;
        }
        if (Array.isArray(item)) {
            const [should, name] = item;
            if (!should) continue;
            className.push(name);
        }
    }
    return className.join(" ");
}
function matchAll(regex, input, parent = false) {
    let matches, output = [];
    while(matches = regex.exec(input)){
        if (parent) output.push(matches);
        else {
            const [, ...match] = matches;
            output.push(match);
        }
    }
    return output;
}

var utilities = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sleep: sleep$1,
    random: random,
    getProps: getProps,
    setProps: setProps,
    createUpdateWrapper: createUpdateWrapper,
    omit: omit,
    joinClassNames: joinClassNames,
    matchAll: matchAll
});

function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
var _parseType = new WeakSet(), _log = new WeakSet();
class Logger$b {
    log(...message) {
        _classPrivateMethodGet(this, _log, log).call(this, "log", ...message);
    }
    info(...message) {
        _classPrivateMethodGet(this, _log, log).call(this, "info", ...message);
    }
    warn(...message) {
        _classPrivateMethodGet(this, _log, log).call(this, "warn", ...message);
    }
    error(...message) {
        _classPrivateMethodGet(this, _log, log).call(this, "error", ...message);
    }
    debug(...message) {
        _classPrivateMethodGet(this, _log, log).call(this, "debug", ...message);
    }
    static create(name) {
        return new Logger$b(name);
    }
    constructor(name){
        _parseType.add(this);
        _log.add(this);
        this.module = name;
    }
}
function parseType(type) {
    switch(type){
        case "info":
        case "warn":
        case "error":
        case "debug":
            return type;
        default:
            return "log";
    }
}
function log(type, ...message) {
    console[_classPrivateMethodGet(this, _parseType, parseType).call(this, type)](`%c[Powercord:${this.module}]%c`, "color: #7289da; font-weight: 700;", "", ...message);
}

const Logger$a = Logger$b.create("Patcher");
class Patcher {
    static getPatchesByCaller(id) {
        if (!id) return [];
        const patches = [];
        for (const patch of this._patches)for (const childPatch of patch.children)if (childPatch.caller === id) patches.push(childPatch);
        return patches;
    }
    static unpatchAll(caller) {
        const patches = this.getPatchesByCaller(caller);
        if (!patches.length) return;
        for (const patch of patches)patch.unpatch();
    }
    static makeOverride(patch) {
        return function() {
            var ref;
            let returnValue, args = arguments;
            if (!(patch === null || patch === void 0 ? void 0 : (ref = patch.children) === null || ref === void 0 ? void 0 : ref.length)) return patch.originalFunction.apply(this, arguments);
            for (const beforePatch of patch.children.filter((e)=>e.type === "before"
            )){
                try {
                    const tempArgs = beforePatch.callback(this, args, patch.originalFunction.bind(this));
                    if (Array.isArray(tempArgs)) args = tempArgs;
                } catch (error) {
                    Logger$a.error(`Could not fire before patch for ${patch.functionName} of ${beforePatch.caller}`, error);
                }
            }
            const insteadPatches = patch.children.filter((e)=>e.type === "instead"
            );
            if (!insteadPatches.length) returnValue = patch.originalFunction.apply(this, args);
            else for (const insteadPatch of insteadPatches){
                try {
                    const tempReturn = insteadPatch.callback(this, args, patch.originalFunction.bind(this));
                    if (typeof tempReturn !== "undefined") returnValue = tempReturn;
                } catch (error) {
                    Logger$a.error(`Could not fire instead patch for ${patch.functionName} of ${insteadPatch.caller}`, error);
                }
            }
            for (const afterPatch of patch.children.filter((e)=>e.type === "after"
            )){
                try {
                    const tempReturn = afterPatch.callback(this, args, returnValue, (ret)=>returnValue = ret
                    );
                    if (typeof tempReturn !== "undefined") returnValue = tempReturn;
                } catch (error) {
                    Logger$a.error(`Could not fire after patch for ${patch.functionName} of ${afterPatch.caller}`, error);
                }
            }
            return returnValue;
        };
    }
    static pushPatch(caller, module, functionName) {
        const patch = {
            caller,
            module,
            functionName,
            originalFunction: module[functionName],
            undo: ()=>{
                patch.module[patch.functionName] = patch.originalFunction;
                patch.children = [];
            },
            count: 0,
            children: []
        };
        module[functionName] = this.makeOverride(patch);
        module[`__powercordOriginal_${functionName}`] = patch.originalFunction;
        Object.assign(module[functionName], patch.originalFunction, {
            toString: ()=>patch.originalFunction.toString()
            ,
            __originalFunction: patch.originalFunction
        });
        return this._patches.push(patch), patch;
    }
    static doPatch(caller, module, functionName, callback, type = "after", options = {
    }) {
        let { displayName  } = options;
        var ref;
        const patch = (ref = this._patches.find((e)=>e.module === module && e.functionName === functionName
        )) !== null && ref !== void 0 ? ref : this.pushPatch(caller, module, functionName);
        if (typeof displayName !== "string") displayName || module.displayName || module.name || module.constructor.displayName || module.constructor.name;
        const child = {
            caller,
            type,
            id: patch.count,
            callback,
            unpatch: ()=>{
                patch.children.splice(patch.children.findIndex((cpatch)=>cpatch.id === child.id && cpatch.type === type
                ), 1);
                if (patch.children.length <= 0) {
                    const patchNum = this._patches.findIndex((p)=>p.module == module && p.functionName == functionName
                    );
                    this._patches[patchNum].undo();
                    this._patches.splice(patchNum, 1);
                }
            }
        };
        patch.children.push(child);
        patch.count++;
        return child.unpatch;
    }
    static before(caller, module, functionName, callback) {
        return this.doPatch(caller, module, functionName, callback, "before");
    }
    static after(caller, module, functionName, callback) {
        return this.doPatch(caller, module, functionName, callback, "after");
    }
    static instead(caller, module, functionName, callback) {
        return this.doPatch(caller, module, functionName, callback, "instead");
    }
}
Patcher._patches = [];

const sleep = (time)=>new Promise((f)=>setTimeout(f, time)
    )
;
function findInTree(tree = {
}, filter = (_)=>_
, { ignore =[] , walkable =[] , maxProperties =100  } = {
}) {
    let stack = [
        tree
    ];
    const wrapFilter = function(...args) {
        try {
            return Reflect.apply(filter, this, args);
        } catch (e) {
            return false;
        }
    };
    while(stack.length && maxProperties){
        const node = stack.shift();
        if (wrapFilter(node)) return node;
        if (Array.isArray(node)) stack.push(...node);
        else if (typeof node === "object" && node !== null) {
            if (walkable.length) {
                for(const key in node){
                    const value = node[key];
                    if (~walkable.indexOf(key) && !~ignore.indexOf(key)) {
                        stack.push(value);
                    }
                }
            } else {
                for(const key in node){
                    const value = node[key];
                    if (node && ~ignore.indexOf(key)) continue;
                    stack.push(value);
                }
            }
        }
        maxProperties--;
    }
}
function findInReactTree(tree, filter, options = {
}) {
    return findInTree(tree, filter, {
        ...options,
        walkable: [
            "props",
            "children"
        ]
    });
}
function getReactInstance(node) {
    return node["__reactFiber$"];
}
function getOwnerInstance(node, filter = (_)=>true
) {
    if (!node) return null;
    const fiber = getReactInstance(node);
    let current = fiber;
    const matches = function() {
        const isInstanceOf = (current === null || current === void 0 ? void 0 : current.stateNode) instanceof DiscordModules.React.Component;
        return isInstanceOf && filter(current === null || current === void 0 ? void 0 : current.stateNode);
    };
    while(!matches()){
        current = current === null || current === void 0 ? void 0 : current.return;
    }
    var ref;
    return (ref = current === null || current === void 0 ? void 0 : current.stateNode) !== null && ref !== void 0 ? ref : null;
}
function forceUpdateElement(selector) {
    var ref;
    (ref = getOwnerInstance(document.querySelector(selector))) === null || ref === void 0 ? void 0 : ref.forceUpdate();
}
async function waitFor(selector) {
    let element = document.querySelector(selector);
    do {
        await sleep(1);
    }while (!(element = document.querySelector(selector)))
    return element;
}

var util$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sleep: sleep,
    findInTree: findInTree,
    findInReactTree: findInReactTree,
    getReactInstance: getReactInstance,
    getOwnerInstance: getOwnerInstance,
    forceUpdateElement: forceUpdateElement,
    waitFor: waitFor
});

function _extends$W() {
    _extends$W = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$W.apply(this, arguments);
}
const patchAvatars = function() {
    var ref5, ref1, ref2;
    const Avatar = Webpack.findByProps("AnimatedAvatar");
    Patcher.after("pc-utility-classes-avatar", Avatar, "default", (_, args, res)=>{
        var ref, ref3;
        if ((ref = args[0]) === null || ref === void 0 ? void 0 : (ref3 = ref.src) === null || ref3 === void 0 ? void 0 : ref3.includes("/avatars")) {
            var ref4;
            res.props["data-user-id"] = (ref4 = args[0].src.match(/\/(?:avatars|users)\/(\d+)/)) === null || ref4 === void 0 ? void 0 : ref4[1];
        }
        return res;
    });
    Patcher.after("pc-utility-classes-animated-avatar", Avatar.AnimatedAvatar, "type", (_, args, res)=>{
        return(/*#__PURE__*/ React.createElement(Avatar.default, _extends$W({
        }, res.props)));
    });
    const AvatarWrapper = (ref2 = (ref5 = Webpack.findByProps([
        "wrapper",
        "avatar"
    ])) === null || ref5 === void 0 ? void 0 : (ref1 = ref5.wrapper) === null || ref1 === void 0 ? void 0 : ref1.split(" ")) === null || ref2 === void 0 ? void 0 : ref2[0];
    setImmediate(()=>forceUpdateElement(`.${AvatarWrapper}`)
    );
};
const injectMessageName = function() {
    const Message = Webpack.findModule((m)=>{
        var ref;
        return ((ref = m === null || m === void 0 ? void 0 : m.toString()) === null || ref === void 0 ? void 0 : ref.indexOf("childrenSystemMessage")) > -1;
    });
    if (!Message) return Logger$b.warn("ComponentPatcher", "Message Component was not found!");
    Message.displayName = "Message";
};
var componentpatcher = promise.then(()=>{
    patchAvatars();
    injectMessageName();
});

class Store {
    has(event) {
        return event in this.events;
    }
    on(event, listener) {
        if (!this.has(event)) this.events[event] = new Set();
        this.events[event].add(listener);
        return ()=>void this.off(event, listener)
        ;
    }
    off(event, listener) {
        if (!this.has(event)) return;
        return this.events[event].delete(listener);
    }
    emit(event, ...args) {
        if (!this.has(event)) return;
        for (const listener of this.events[event]){
            try {
                listener(...args);
            } catch (error) {
                Logger$b.error(`Store:${this.constructor.name}`, error);
            }
        }
    }
    useEvent(event, listener) {
        const [state, setState] = DiscordModules.React.useState(listener());
        DiscordModules.React.useEffect(()=>{
            return this.on(event, ()=>setState(listener())
            );
        }, [
            event,
            listener
        ]);
        return state;
    }
    constructor(){
        this.events = {
        };
    }
}

class Emitter {
    static has(event) {
        return event in this.events;
    }
    static on(event, listener) {
        if (!this.has(event)) this.events[event] = new Set();
        this.events[event].add(listener);
        return this.off.bind(this, event, listener);
    }
    static off(event, listener) {
        if (!this.has(event)) return;
        return this.events[event].delete(listener);
    }
    static emit(event, ...args) {
        if (!this.has(event)) return;
        for (const listener of this.events[event]){
            try {
                listener(...args);
            } catch (error) {
                Logger$b.error(`Store:${this.constructor.name}`, "Could not fire callback:", error);
            }
        }
    }
}
Emitter.events = {
};

class fs {
    static readFileSync(path, options = "utf8") {
        return PCCompatNative.executeJS(`require("fs").readFileSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
    }
    static writeFileSync(path, data, options) {
        return PCCompatNative.executeJS(`require("fs").writeFileSync(${JSON.stringify(path)}, ${JSON.stringify(data)}, ${JSON.stringify(options)})`);
    }
    static writeFile(path, data, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = null;
        }
        const ret = {
            error: null
        };
        try {
            this.writeFileSync(path, data, options);
        } catch (error) {
            ret.error = error;
        }
        callback(ret.error);
    }
    static readdirSync(path, options) {
        return PCCompatNative.executeJS(`require("fs").readdirSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
    }
    static existsSync(path) {
        return PCCompatNative.executeJS(`require("fs").existsSync(${JSON.stringify(path)});`);
    }
    static mkdirSync(path, options) {
        return PCCompatNative.executeJS(`require("fs").mkdirSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
    }
    static statSync(path, options) {
        return PCCompatNative.executeJS(`
            const stats = require("fs").statSync(${JSON.stringify(path)}, ${JSON.stringify(options)});
            const ret = {
                ...stats,
                isFile: () => stats.isFile(),
                isDirectory: () => stats.isDirectory()
            };
            ret
        `);
    }
    static watch(path, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = null;
        }
        const eventId = "bdcompat-watcher-" + Math.random().toString(36).slice(2, 10);
        PCCompatNative.IPC.on(eventId, (event, filename)=>{
            callback(event, filename);
        });
        return PCCompatNative.executeJS(`
            require("fs").watch(${JSON.stringify(path)}, ${JSON.stringify(options)}, (event, filename) => {
                PCCompatNative.IPC.dispatch(${JSON.stringify(eventId)}, event, filename);
            });
        `);
    }
}

const path = PCCompatNative.executeJS(`require("path")`);

const ipcRenderer = PCCompatNative.executeJS(`Object.keys(require("electron").ipcRenderer)`).slice(3).reduce((newElectron, key)=>{
    newElectron[key] = PCCompatNative.executeJS(`require("electron").ipcRenderer[${JSON.stringify(key)}].bind(require("electron").ipcRenderer)`);
    return newElectron;
}, {
});
const shell = PCCompatNative.executeJS(`require("electron").shell`);
const clipboard = PCCompatNative.executeJS(`require("electron").clipboard`);
const contextBridge = {
    exposeInMainWorld (name, value) {
        window[name] = value;
    }
};
const electron = {
    ipcRenderer,
    shell,
    contextBridge,
    clipboard
};

function _extends$V() {
    _extends$V = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$V.apply(this, arguments);
}
const cache$4 = new Map();
function DiscordIcon({ name , ...props }) {
    var ref, ref1;
    const IconComponent = (ref1 = (ref = cache$4.get(name)) !== null && ref !== void 0 ? ref : (cache$4.set(name, Webpack.findByDisplayName(name)), cache$4.get(name))) !== null && ref1 !== void 0 ? ref1 : ()=>null
    ;
    return(/*#__PURE__*/ React.createElement(IconComponent, _extends$V({
    }, props)));
}

function memoize(target, key, value) {
    Object.defineProperty(target, key, {
        value: value,
        configurable: true
    });
    return value;
}

function _extends$U() {
    _extends$U = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$U.apply(this, arguments);
}
function AsyncComponent({ _provider , _fallback , ...props }) {
    const [Component, setComponent] = DiscordModules.React.useState(()=>_fallback !== null && _fallback !== void 0 ? _fallback : ()=>null
    );
    DiscordModules.React.useEffect(()=>{
        _provider().then((comp)=>setComponent(()=>comp
            )
        );
    }, [
        _provider,
        _fallback
    ]);
    return(/*#__PURE__*/ React.createElement(Component, _extends$U({
    }, props)));
}function from(promise, fallback) {
    return (props)=>DiscordModules.React.createElement(AsyncComponent, {
            _provider: ()=>promise
            ,
            _fallback: fallback,
            ...props
        })
    ;
}
const fromPromise = from; // Alias
function fromDisplayName(displayName, fallback) {
    return from(Webpack.findByDisplayName(displayName, {
        wait: true
    }), fallback);
}
Object.assign(AsyncComponent, {
    from,
    fromDisplayName
}); // TODO: Add fromModule and fromModuleProp

var Divider = fromPromise(promise.then(()=>{
    const { Forms  } = DiscordModules;
    return function Divider() {
        return(/*#__PURE__*/ React.createElement(Forms.FormDivider, {
            className: "pc-settings-divider"
        }));
    };
}));

const FormItem = fromPromise(promise.then(()=>{
    const { Forms , Flex , FormClasses , Margins  } = DiscordModules;
    return function FormItem({ title , required , children , note , noteHasMargin  }) {
        const noteClasses = [
            FormClasses.description,
            noteHasMargin && Margins.marginTop8
        ].filter(Boolean).join(" ");
        return(/*#__PURE__*/ React.createElement(Forms.FormItem, {
            className: `${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP} ${Margins.marginBottom20}`,
            required: required,
            title: title
        }, children, note && /*#__PURE__*/ React.createElement(Forms.FormText, {
            className: noteClasses
        }, note), /*#__PURE__*/ React.createElement(Divider, null)));
    };
}));

function _extends$T() {
    _extends$T = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$T.apply(this, arguments);
}
function TextInput(props) {
    const { TextInput: TextInput1  } = DiscordModules;
    const { children: title , note , required  } = props;
    delete props.children;
    return(/*#__PURE__*/ React.createElement(FormItem, {
        title: title,
        note: note,
        required: required,
        noteHasMargin: true
    }, /*#__PURE__*/ React.createElement(TextInput1, _extends$T({
    }, props, {
        required: required
    }))));
}

class Modals {
    static get TextInput() {
        return memoize(this, "TextInput", createUpdateWrapper(TextInput));
    }
    static showConfirmationModal(title, content, options = {
    }) {
        const { confirmText ="Okay" , cancelText ="Cancel" , onConfirm =()=>{
        } , onCancel =()=>{
        } , danger =false  } = options;
        const { ModalsApi , ConfirmationModal , React , Markdown , Button  } = DiscordModules;
        return ModalsApi.openModal((props)=>{
            return React.createElement(ConfirmationModal, Object.assign({
                header: title,
                confirmText: confirmText,
                cancelText: cancelText,
                onConfirm,
                onCancel,
                confirmButtonColor: danger ? Button.Colors.RED : Button.Colors.BRAND
            }, props), typeof content === "string" ? React.createElement(Markdown, null, content) : content);
        });
    }
    static prompt(title, content, options = {
    }) {
        const { placeholder ="" , onInput =()=>{
        }  } = options;
        let value = "";
        return this.showConfirmationModal(title, React.createElement(this.TextInput, {
            note: content,
            value: value,
            placeholder: placeholder,
            onChange: (val)=>{
                value = val;
            }
        }), {
            onConfirm: ()=>{
                onInput(value);
            }
        });
    }
    static alert(title, content) {
        return this.showConfirmationModal(title, content, {
            cancelText: null
        });
    }
}

const Icon$1 = fromPromise(promise.then(()=>{
    const Icons = Webpack.findModules((m)=>typeof m === 'function' && m.toString().indexOf('"currentColor"') !== -1
    );
    function IconComponent(props) {
        const mdl = Icons.find((i)=>i.displayName === props.name
        );
        const Props = _.cloneDeep(props);
        delete Props.name;
        return React.createElement(mdl, Props);
    }
    Icon$1.Names = Icons.map((m)=>m.displayName
    );
    return IconComponent;
}));

const ErrorState = fromPromise(promise.then(()=>{
    const { Margins , Markdown  } = DiscordModules;
    const { error , backgroundRed , icon , text  } = Webpack.findByProps('error', 'backgroundRed');
    return function ErrorState({ children  }) {
        return(/*#__PURE__*/ React.createElement("div", {
            className: `${error} ${backgroundRed} ${Margins.marginBottom20}`
        }, /*#__PURE__*/ React.createElement(Icon$1, {
            className: icon,
            name: "WarningCircle"
        }), /*#__PURE__*/ React.createElement("div", {
            className: text
        }, /*#__PURE__*/ React.createElement(Markdown, null, children))));
    };
}));

const ErrorBoundary = fromPromise(promise.then(()=>{
    return class ErrorBoundary extends DiscordModules.React.Component {
        static getDerivedStateFromError(error) {
            return {
                hasError: true,
                error: error.message
            };
        }
        componentDidCatch(error, errorInfo) {
            console.error(error, errorInfo);
        }
        render() {
            if (this.state.hasError) {
                return(/*#__PURE__*/ React.createElement(ErrorState, null, this.state.error));
            }
            return this.props.children;
        }
        constructor(...args){
            super(...args);
            this.state = {
                hasError: false,
                error: null
            };
        }
    };
}));

let SettingsContext = null;
promise.then(()=>{
    SettingsContext = DiscordModules.React.createContext();
});
function SettingsPanel$1({ store , name , children , header =null  }) {
    const { Caret  } = DiscordModules;
    const [, forceUpdate] = DiscordModules.React.useReducer((n)=>n + 1
    , 0);
    const [subPage, setSubPage] = DiscordModules.React.useState({
        label: "",
        render: null
    });
    const hasSubPage = DiscordModules.React.useMemo(()=>{
        return typeof subPage.render === "function" && subPage.label;
    }, [
        subPage
    ]);
    DiscordModules.React.useEffect(()=>{
        store.addChangeListener(forceUpdate);
        return ()=>{
            store.removeChangeListener(forceUpdate);
        };
    }, [
        store
    ]);
    const API = {
        setPage (options) {
            setSubPage(options);
        },
        reset () {
            setSubPage({
                render: null,
                label: ""
            });
        }
    };
    return(/*#__PURE__*/ React.createElement(ErrorBoundary, null, /*#__PURE__*/ React.createElement(SettingsContext.Provider, {
        value: API
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-panel"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-title"
    }, hasSubPage ? /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-title-name",
        onClick: ()=>API.reset()
    }, name) : name, hasSubPage ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Caret, {
        direction: Caret.Directions.RIGHT,
        className: "pc-settings-title-caret"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-title-sub"
    }, subPage.label)) : null, header), hasSubPage ? subPage.render() : children()))));
}

let SettingsModule;
promise.then(()=>{
    SettingsModule = class SettingsModule extends DiscordModules.Flux.Store {
        connectStore() {
            return DiscordModules.Flux.connectStores([
                this
            ], ()=>this.makeProps()
            );
        }
        makeProps() {
            return {
                settings: this.settings,
                getSetting: this.get.bind(this),
                updateSetting: this.set.bind(this),
                toggleSetting: this.toggle.bind(this)
            };
        }
        constructor(id1){
            super(DiscordModules.Dispatcher, {
            });
            this.getKeys = ()=>{
                return Reflect.ownKeys(this.settings);
            };
            this.get = (id, defaultValue)=>{
                var _id;
                return (_id = this.settings[id]) !== null && _id !== void 0 ? _id : defaultValue;
            };
            this.toggle = (id)=>{
                this.set(id, !this.get(id));
            };
            this.set = (id, value)=>{
                if (value === void 0) {
                    this.toggle(id);
                } else {
                    this.settings[id] = value;
                }
                this.save();
            };
            this.save = ()=>{
                DataStore$1.trySaveData(this.id, this.settings);
                this.emitChange();
            };
            this.settings = DataStore$1.tryLoadData(id1);
            this.id = id1;
        }
    };
});
const cache$3 = new Map();
function getSettings(id) {
    if (!cache$3.has(id)) {
        const Settings = new SettingsModule(id);
        cache$3.set(id, Settings);
        Settings.save();
        return Settings;
    }
    return cache$3.get(id);
}

let store = null;
let settings = new Map();
promise.then(()=>{
    store = Object.assign(getSettings("powercord"), {
        // powerCord momento
        _fluxProps (id) {
            return getSettings(id).makeProps();
        }
    });
});
function registerSettings(id, options) {
    id = id || options.category;
    options.render = connectStores(id)(options.render);
    settings.set(id, options);
}
function unregisterSettings(id) {
    settings.delete(id);
}
function _fluxProps(id) {
    var ref;
    return (ref = getSettings(id)) === null || ref === void 0 ? void 0 : ref.makeProps();
}
function connectStores(id) {
    var ref;
    return (ref = getSettings(id)) === null || ref === void 0 ? void 0 : ref.connectStore();
}

var settings$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get store () { return store; },
    settings: settings,
    registerSettings: registerSettings,
    unregisterSettings: unregisterSettings,
    _fluxProps: _fluxProps,
    connectStores: connectStores
});

function _extends$S() {
    _extends$S = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$S.apply(this, arguments);
}
function ToolButton({ label , icon , onClick , danger =false , disabled =false  }) {
    const { Button , Tooltips: { Tooltip  }  } = DiscordModules;
    return(/*#__PURE__*/ React.createElement(Tooltip, {
        text: label,
        position: "top"
    }, (props)=>/*#__PURE__*/ React.createElement(Button, _extends$S({
        }, props, {
            className: "pc-settings-toolbutton",
            look: Button.Looks.BLANK,
            size: Button.Sizes.NONE,
            onClick: onClick,
            disabled: disabled
        }), /*#__PURE__*/ React.createElement(DiscordIcon, {
            name: icon,
            color: danger ? "#ed4245" : void 0,
            width: "20",
            height: "20"
        }))
    ));
}
function ButtonWrapper({ value , onChange , disabled =false  }) {
    const { Switch  } = DiscordModules;
    const [isChecked, setChecked] = React.useState(value);
    return(/*#__PURE__*/ React.createElement(Switch, {
        className: "pc-settings-addons-switch",
        checked: isChecked,
        disabled: disabled,
        onChange: ()=>{
            onChange(!isChecked);
            setChecked(!isChecked);
        }
    }));
}
function getPanel(id) {
    const get = settings.get(id);
    if (get) return get;
    for (const [key, options] of settings.entries()){
        if (options.category == id) return settings.get(key);
    }
    return null;
}
function AddonCard({ addon , manager , openSettings , hasSettings , type  }) {
    var ref, ref1, ref2;
    const { Markdown  } = DiscordModules;
    const [, forceUpdate] = React.useReducer((n)=>n + 1
    , 0);
    const SettingsApi = React.useContext(SettingsContext);
    React.useEffect(()=>{
        manager.on("toggle", (name)=>{
            if (name !== addon.entityID) return;
            forceUpdate();
        });
    }, [
        addon,
        manager
    ]);
    var ref3, ref4;
    return(/*#__PURE__*/ React.createElement("div", {
        style: {
            "--plugin-color": addon.color
        },
        className: "pc-settings-addon-card " + ((ref = addon.manifest.name) === null || ref === void 0 ? void 0 : ref.replace(/ /g, "-"))
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-card-header"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-card-field pc-settings-card-name"
    }, addon.manifest.name), "version" in addon.manifest && /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-card-field"
    }, "v", addon.manifest.version), "author" in addon.manifest && /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-card-field"
    }, " by ", addon.manifest.author), /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-card-controls"
    }, getPanel(addon.entityID) && /*#__PURE__*/ React.createElement(ToolButton, {
        label: "Settings",
        icon: "Gear",
        onClick: ()=>{
            const Settings = getPanel(addon.entityID);
            SettingsApi.setPage({
                label: addon.manifest.name,
                render: typeof Settings.render === "function" ? ()=>DiscordModules.React.createElement(Settings.render, cache$3.get(addon.entityID).makeProps())
                 : Settings.render
            });
        }
    }), /*#__PURE__*/ React.createElement(ToolButton, {
        label: "Reload",
        icon: "Replay",
        disabled: (ref3 = !((ref1 = manager.isEnabled) === null || ref1 === void 0 ? void 0 : ref1.call(manager, addon))) !== null && ref3 !== void 0 ? ref3 : true,
        onClick: ()=>manager.reload(addon)
    }), /*#__PURE__*/ React.createElement(ToolButton, {
        label: "Open Path",
        icon: "Folder",
        onClick: ()=>{
            PCCompatNative.executeJS(`require("electron").shell.showItemInFolder(${JSON.stringify(addon.path)})`);
        }
    }), /*#__PURE__*/ React.createElement(ToolButton, {
        label: "Delete",
        icon: "Trash",
        onClick: ()=>{
            Modals.showConfirmationModal("Are you sure?", `Are you sure that you want to delete the ${type} "${addon.manifest.name}"?`, {
                danger: true,
                onConfirm: ()=>{
                    manager.delete(addon.entityID);
                }
            });
        }
    }), /*#__PURE__*/ React.createElement(ButtonWrapper, {
        value: (ref4 = (ref2 = manager.isEnabled) === null || ref2 === void 0 ? void 0 : ref2.call(manager, addon)) !== null && ref4 !== void 0 ? ref4 : false,
        onChange: ()=>{
            manager.toggle(addon);
        }
    }))), addon.manifest.description && /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-card-desc"
    }, /*#__PURE__*/ React.createElement(Markdown, null, addon.manifest.description))));
}

function _extends$R() {
    _extends$R = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$R.apply(this, arguments);
}
const sortLabels = [
    "name",
    "author",
    "version",
    "description",
    "added"
];
const searchLabels = [
    "name",
    "author",
    "description"
];
const orderLabels = [
    "ascending",
    "descending"
];
async function sortAddons(addons, order, query, searchOptions, sortBy) {
    return addons.filter((addon)=>{
        if (!query) return true;
        const { manifest  } = addon;
        var _type;
        // Use String() wrapper for clever escaping
        return [
            "name",
            "author",
            "description"
        ].some((type)=>searchOptions[type] && String((_type = manifest[type]) !== null && _type !== void 0 ? _type : "").toLowerCase().includes(query.toLowerCase())
        );
    }).sort((a, b)=>{
        var _sortBy;
        const first = (_sortBy = a.manifest[sortBy]) !== null && _sortBy !== void 0 ? _sortBy : "";
        var _sortBy1;
        const second = (_sortBy1 = b.manifest[sortBy]) !== null && _sortBy1 !== void 0 ? _sortBy1 : "";
        if (typeof first === "string") return String(first).toLowerCase().localeCompare(String(second).toLowerCase());
        if (first > second) return 1;
        if (second > first) return -1;
        return 0;
    })[order === "ascending" ? "reverse" : "slice"](0);
}
function OverflowContextMenu({ type: addonType  }) {
    const { ContextMenu  } = DiscordModules;
    const [sortBy, searchOptions, order] = DataStore$1.useEvent("misc", ()=>[
            DataStore$1.getMisc(`${addonType}.sortBy`, "name"),
            DataStore$1.getMisc(`${addonType}.searchOption`, {
                author: true,
                name: true,
                description: true
            }),
            DataStore$1.getMisc(`${addonType}.order`, "descending")
        ]
    );
    return(/*#__PURE__*/ React.createElement(ContextMenu.Menu, {
        navId: "OverflowContextMenu"
    }, /*#__PURE__*/ React.createElement(ContextMenu.ControlItem, {
        id: "order-header",
        control: ()=>/*#__PURE__*/ React.createElement("h5", {
                className: "pc-settings-overflow-header"
            }, "Order")
    }), /*#__PURE__*/ React.createElement(ContextMenu.Separator, {
        key: "separator"
    }), /*#__PURE__*/ React.createElement(ContextMenu.Group, null, orderLabels.map((type)=>/*#__PURE__*/ React.createElement(ContextMenu.RadioItem, {
            key: "order-" + type,
            label: type[0].toUpperCase() + type.slice(1),
            checked: order === type,
            id: "sortBy-" + type,
            action: ()=>{
                DataStore$1.setMisc(void 0, `${addonType}.order`, type);
            }
        })
    )), /*#__PURE__*/ React.createElement(ContextMenu.Separator, {
        key: "separator"
    }), /*#__PURE__*/ React.createElement(ContextMenu.ControlItem, {
        id: "sort-header",
        control: ()=>/*#__PURE__*/ React.createElement("h5", {
                className: "pc-settings-overflow-header"
            }, "Sort Options")
    }), /*#__PURE__*/ React.createElement(ContextMenu.Separator, {
        key: "separator"
    }), /*#__PURE__*/ React.createElement(ContextMenu.Group, null, sortLabels.map((type)=>/*#__PURE__*/ React.createElement(ContextMenu.RadioItem, {
            key: "sortBy-" + type,
            label: type[0].toUpperCase() + type.slice(1),
            checked: sortBy === type,
            id: "sortBy-" + type,
            action: ()=>{
                DataStore$1.setMisc(void 0, `${addonType}.sortBy`, type);
            }
        })
    )), /*#__PURE__*/ React.createElement(ContextMenu.Separator, {
        key: "separator"
    }), /*#__PURE__*/ React.createElement(ContextMenu.ControlItem, {
        id: "search-header",
        control: ()=>/*#__PURE__*/ React.createElement("h5", {
                className: "pc-settings-overflow-header"
            }, "Search Options")
    }), /*#__PURE__*/ React.createElement(ContextMenu.Separator, {
        key: "separator"
    }), /*#__PURE__*/ React.createElement(ContextMenu.Group, null, searchLabels.map((type)=>/*#__PURE__*/ React.createElement(ContextMenu.CheckboxItem, {
            key: "search-" + type,
            id: "search-" + type,
            label: type[0].toUpperCase() + type.slice(1),
            checked: searchOptions[type],
            action: ()=>{
                DataStore$1.setMisc(void 0, `${addonType}.searchOption.${type}`, !searchOptions[type]);
            }
        })
    ))));
}
function AddonPanel({ manager , type  }) {
    const { React: React1 , Button , ContextMenu , Tooltips , SearchBar , PlaceholderClasses  } = DiscordModules;
    const { i18n: { Messages  }  } = powercord.webpack;
    const [query, setQuery] = React1.useState("");
    const [addons1, setAddons] = React1.useState(null);
    const [sortBy, searchOptions, order] = DataStore$1.useEvent("misc", ()=>[
            DataStore$1.getMisc(`${type}.sortBy`, "name"),
            DataStore$1.getMisc(`${type}.searchOption`, {
                author: true,
                name: true,
                description: true
            }),
            DataStore$1.getMisc(`${type}.order`, "descending")
        ]
    );
    React1.useEffect(()=>{
        manager.on("delete", ()=>{
            setAddons(manager.addons);
        });
    }, [
        manager
    ]);
    React1.useEffect(()=>{
        sortAddons(Array.from(manager.addons), order, query, searchOptions, sortBy).then((addons)=>setAddons(addons)
        );
    }, [
        query,
        manager,
        type,
        order,
        searchOptions,
        sortBy
    ]);
    return(/*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-addons"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-addons-controls"
    }, /*#__PURE__*/ React.createElement(SearchBar, {
        // @ts-ignore
        onChange: (value)=>setQuery(value)
        ,
        onClear: ()=>setQuery("")
        ,
        placeholder: `Search ${type}s...`,
        size: SearchBar.Sizes.SMALL,
        query: query,
        className: "pc-settings-addons-search"
    }), /*#__PURE__*/ React.createElement(Tooltips.Tooltip, {
        text: "Options",
        position: "bottom"
    }, (props)=>/*#__PURE__*/ React.createElement(Button, _extends$R({
        }, props, {
            size: Button.Sizes.NONE,
            look: Button.Looks.BLANK,
            className: "pc-settings-overflow-menu",
            onClick: (e)=>{
                ContextMenu.open(e, ()=>/*#__PURE__*/ React.createElement(OverflowContextMenu, {
                        type: type
                    })
                );
            }
        }), /*#__PURE__*/ React.createElement(DiscordIcon, {
            name: "OverflowMenu"
        }))
    )), /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-card-scroller"
    }, (addons1 === null || addons1 === void 0 ? void 0 : addons1.length) ? addons1.map((addon)=>/*#__PURE__*/ React.createElement(AddonCard, {
            addon: addon,
            hasSettings: false,
            manager: manager,
            type: type,
            key: addon.manifest.name,
            openSettings: ()=>{
            }
        })
    ) : /*#__PURE__*/ React.createElement("div", {
        className: "pc-settings-empty"
    }, /*#__PURE__*/ React.createElement("div", {
        className: PlaceholderClasses.emptyStateImage
    }), /*#__PURE__*/ React.createElement("p", null, Messages.GIFT_CONFIRMATION_HEADER_FAIL), /*#__PURE__*/ React.createElement("p", null, Messages.SEARCH_NO_RESULTS)))));
}

class SettingsRenderer {
    static get sidebarClass() {
        return memoize(this, "sidebarClass", Webpack.findByProps("standardSidebarView"));
    }
    static registerPanel(id, options) {
        const { label , render , order  } = options;
        const tab = this.panels.find((e)=>e.id === id
        );
        if (tab) throw new Error(`Settings tab ${id} is already registered!`);
        var _header;
        const panel = {
            section: "pc-moduleManager-" + label,
            label: label,
            id: id,
            order: order,
            className: `pccompat-settings-${id}-item`,
            element: ()=>DiscordModules.React.createElement(SettingsPanel$1, {
                    name: label,
                    store: getSettings(id),
                    children: render,
                    header: (_header = options.header) !== null && _header !== void 0 ? _header : null
                })
        };
        this.panels = this.panels.concat(panel).sort(this.sortPanels);
        return ()=>{
            const index = this.panels.indexOf(panel);
            if (index < 0) return false;
            this.panels.splice(index, 1);
            return true;
        };
    }
    static unregisterPanel(id) {
        const panel = this.panels.findIndex((e)=>e.id === id
        );
        if (panel < 0) return;
        this.panels.splice(panel, 1);
        this.forceUpdate();
    }
    static sortPanels(a, b) {
        return a.order - b.order;
    }
    static patchSettingsView() {
        const SettingsView = Webpack.findByDisplayName("SettingsView");
        Patcher.after("PCSettings", SettingsView.prototype, "getPredicateSections", (_, __, res)=>{
            if (!Array.isArray(res) || !res.some((e)=>{
                var ref;
                return (e === null || e === void 0 ? void 0 : (ref = e.section) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === "changelog";
            }) || res.some((s)=>{
                return (s === null || s === void 0 ? void 0 : s.id) === "pc-settings";
            })) return;
            const index = res.findIndex((s)=>{
                var ref;
                return (s === null || s === void 0 ? void 0 : (ref = s.section) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === "changelog";
            }) - 1;
            if (index < 0) return;
            res.splice(index, 0, ...SettingsRenderer.defaultPanels.concat(SettingsRenderer.panels));
        });
    }
    static forceUpdate() {
        const [node] = document.getElementsByName(this.sidebarClass.standardSidebarView);
        if (!node) return;
        const instance = getOwnerInstance(node, (e)=>{
            var ref;
            return (e === null || e === void 0 ? void 0 : (ref = e.constructor) === null || ref === void 0 ? void 0 : ref.displayName) === "SettingsView";
        });
        if (instance) instance.forceUpdate();
    }
}
SettingsRenderer.defaultPanels = [
    {
        section: "DIVIDER"
    },
    {
        section: "HEADER",
        label: "Powercord"
    }, 
];
SettingsRenderer.panels = [];

const Logger$9 = Logger$b.create("PluginManager");
class PluginManager extends Emitter {
    static get folder() {
        return path.resolve(DataStore$1.baseDir, "plugins");
    }
    static get addons() {
        return Array.from(this.plugins, (e)=>e[1]
        );
    }
    static initialize() {
        SettingsRenderer.registerPanel("plugins", {
            label: "Plugins",
            order: 1,
            render: ()=>DiscordModules.React.createElement(AddonPanel, {
                    type: "plugin",
                    manager: this
                })
        });
        this.states = DataStore$1.tryLoadData("plugins");
        this.loadAllPlugins();
    }
    static loadAllPlugins() {
        if (!fs.existsSync(this.folder)) {
            try {
                fs.mkdirSync(this.folder);
            } catch (error) {
                return void Logger$9.error("PluginsManager", `Failed to create plugins folder:`, error);
            }
        }
        if (!fs.statSync(this.folder).isDirectory()) return void Logger$9.error("PluginsManager", `Plugins dir isn't a folder.`);
        Logger$9.log("PluginsManager", "Loading plugins...");
        for (const file of fs.readdirSync(this.folder, "utf8")){
            const location = path.resolve(this.folder, file);
            if (!fs.statSync(location).isDirectory()) continue;
            if (!fs.existsSync(path.join(location, "manifest.json"))) continue;
            if (!fs.statSync(path.join(location, "manifest.json")).isFile()) continue;
            if (!this.mainFiles.some((f)=>fs.existsSync(path.join(location, f))
            )) continue;
            if (fs.existsSync(path.join(location, "node_modules"))) globalPaths.push(path.join(location, "node_modules"));
            try {
                this.loadPlugin(location);
            } catch (error) {
                Logger$9.error(`Failed to load ${file}:`, error);
            }
        }
    }
    static clearCache(plugin) {
        if (!path.isAbsolute(plugin)) plugin = path.resolve(this.folder, plugin);
        let current;
        while(current = Require.resolve(plugin)){
            delete NodeModule.cache[current];
        }
    }
    static resolve(pluginOrName) {
        if (typeof pluginOrName === "string") return this.plugins.get(pluginOrName);
        return pluginOrName;
    }
    static saveData() {
        DataStore$1.trySaveData("plugins", this.states);
    }
    static isEnabled(addon) {
        const plugin = this.resolve(addon);
        if (!plugin) return;
        return Boolean(this.states[plugin.entityID]);
    }
    static loadPlugin(location, log = true) {
        const _path = path.resolve(location, this.mainFiles.find((f)=>fs.existsSync(path.resolve(location, f))
        ));
        const manifest = Object.freeze(Require(path.resolve(location, "manifest.json")));
        if (this.plugins.get(manifest.name)) throw new Error(`Plugin with name ${manifest.name} already exists!`);
        let exports = {
        };
        try {
            this.clearCache(location);
            const data = Require(_path);
            Object.defineProperties(data.prototype, {
                entityID: {
                    value: path.basename(location),
                    configurable: false,
                    writable: false
                },
                manifest: {
                    value: manifest,
                    configurable: false,
                    writable: false
                },
                settings: {
                    value: getSettings(path.basename(location)),
                    configurable: true,
                    writable: true
                },
                path: {
                    value: location,
                    configurable: false,
                    writable: false
                }
            });
            exports = new data(path.basename(location), location);
        } catch (error) {
            return void Logger$9.error(`Failed to compile ${manifest.name || path.basename(location)}:`, error);
        }
        if (log) {
            Logger$9.log(`${manifest.name} was loaded!`);
        }
        this.plugins.set(path.basename(location), exports);
        if (this.isEnabled(path.basename(location))) {
            this.startPlugin(exports);
        }
    }
    static unloadAddon(addon, log = true) {
        const plugin = this.resolve(addon);
        if (!addon) return;
        const success = this.stopPlugin(plugin);
        this.plugins.delete(plugin.entityID);
        this.clearCache(plugin.path);
        if (log) {
            Logger$9.log(`${plugin.displayName} was unloaded!`);
        }
        return success;
    }
    static reloadPlugin(addon) {
        const plugin = this.resolve(addon);
        if (!addon) return;
        const success = this.unloadAddon(plugin, false);
        if (!success) {
            return Logger$9.error(`Something went wrong while trying to unload ${plugin.displayName}:`);
        }
        this.loadPlugin(plugin.path, false);
        Logger$9.log(`Finished reloading ${plugin.displayName}.`);
    }
    static startPlugin(addon, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;
        try {
            if (typeof plugin.startPlugin === "function") plugin.startPlugin();
            if (log) {
                Logger$9.log(`${plugin.displayName} has been started!`);
            }
        } catch (error) {
            Logger$9.error(`Could not start ${plugin.displayName}:`, error);
        }
        return true;
    }
    static stopPlugin(addon, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;
        try {
            if (typeof plugin.pluginWillUnload === "function") plugin.pluginWillUnload();
            if (log) {
                Logger$9.log(`${plugin.displayName} has been stopped!`);
            }
        } catch (error) {
            Logger$9.error(`Could not stop ${plugin.displayName}:`, error);
            return false;
        }
        return true;
    }
    static enablePlugin(addon, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;
        this.states[plugin.entityID] = true;
        DataStore$1.trySaveData("plugins", this.states);
        this.startPlugin(plugin, false);
        if (log) {
            Logger$9.log(`${plugin.displayName} has been enabled!`);
            this.emit("toggle", plugin.entityID, true);
        }
    }
    static disablePlugin(addon, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;
        this.states[plugin.entityID] = false;
        DataStore$1.trySaveData("plugins", this.states);
        this.stopPlugin(plugin, false);
        if (log) {
            Logger$9.log(`${plugin.displayName} has been disabled!`);
            this.emit("toggle", plugin.entityID, false);
        }
    }
    static delete(addon) {
        const plugin = this.resolve(addon);
        if (!plugin) return;
        this.unloadAddon(plugin);
        PCCompatNative.executeJS(`require("electron").shell.trashItem(${JSON.stringify(plugin.path)})`);
        this.emit("delete", plugin);
    }
    static toggle(addon) {
        const plugin = this.resolve(addon);
        if (!plugin) return;
        if (this.isEnabled(plugin.entityID)) this.disable(plugin);
        else this.enable(plugin);
    }
    static get(name) {
        return this.plugins.get(name);
    }
    static getPlugins() {
        return [
            ...this.plugins.keys()
        ];
    }
    static get enable() {
        return this.enablePlugin;
    }
    static get disable() {
        return this.disablePlugin;
    }
    static get reload() {
        return this.reloadPlugin;
    }
    static get remount() {
        return this.reloadPlugin;
    }
}
PluginManager.mainFiles = [
    "index.js",
    "index.jsx"
];
PluginManager.plugins = new Map();

class Plugin$1 {
    get color() {
        return "#7289da";
    }
    loadStylesheet(_path) {
        const stylePath = path.isAbsolute(_path) ? _path : path.resolve(this.path, _path);
        try {
            if (!fs.existsSync(stylePath)) throw new Error(`Stylesheet not found at ${stylePath}`);
            const content = Require(stylePath);
            const id = `${this.entityID}-${random()}`;
            this.stylesheets[id] = DOM.injectCSS(id, content);
        } catch (error) {
            console.error(`Could not load stylesheet:`, error);
        }
    }
    log(...messages) {
        console.log(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }
    debug(...messages) {
        console.debug(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }
    warn(...messages) {
        console.warn(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }
    error(...messages) {
        console.error(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }
    // "Internals" :zere_zoom:
    _load() {
        PluginManager.startPlugin(this);
    }
    _unload() {
        PluginManager.stopPlugin(this);
    }
    // Getters
    get displayName() {
        return this.manifest.name;
    }
    constructor(){
        this.stylesheets = {
        };
    }
}

class Theme$1 {
    get color() {
        return "#7289da";
    }
    // "Internals" :zere_zoom:
    _loadStylesheet(_path) {
        const stylePath = path.isAbsolute(_path) ? _path : path.resolve(this.path, _path);
        try {
            if (!fs.existsSync(stylePath)) throw new Error(`Stylesheet not found at ${stylePath}`);
            const content = Require(stylePath);
            const id = `${this.entityID}-${random()}`;
            this.stylesheets[id] = DOM.injectCSS(id, content);
        } catch (error) {
            console.error(`Could not load stylesheet:`, error);
        }
    }
    _load() {
        this._loadStylesheet(path.resolve(this.path, this.manifest.theme));
    }
    _unload() {
        const keys = Object.keys(this.stylesheets);
        for(let i = 0; i < keys.length; i++){
            this.stylesheets[keys[i]].remove();
            delete this.stylesheets[keys[i]];
        }
    }
    // Getters
    get displayName() {
        return this.manifest.name;
    }
    constructor(){
        this.stylesheets = {
        };
    }
}

var entities = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Plugin: Plugin$1,
    Theme: Theme$1
});

/**
 * Creates a updateable react store with a remote api.
 * @param {Any} state Intitial State of your store
 */ function createStore(state) {
    const listeners = new Set();
    const Api = Object.freeze({
        get listeners () {
            return listeners;
        },
        getState (factory = (_)=>_
        ) {
            return factory(state);
        },
        setState (partial) {
            const partialState = typeof partial === "function" ? partial(state) : partial;
            if (Object.is(state, partialState)) return;
            state = Object.assign({
            }, state, partialState);
            listeners.forEach((listener)=>{
                listener(state);
            });
        },
        addListener (listener) {
            if (listeners.has(listener)) return;
            listeners.add(listener);
            return ()=>listeners.delete(listener)
            ;
        },
        removeListener (listener) {
            return listeners.delete(listener);
        }
    });
    function useState(factory = (_)=>_
    ) {
        const [, forceUpdate] = DiscordModules.React.useReducer((e)=>e + 1
        , 0);
        DiscordModules.React.useEffect(()=>{
            const handler = ()=>forceUpdate()
            ;
            listeners.add(handler);
            return ()=>listeners.delete(handler)
            ;
        }, []);
        return Api.getState(factory);
    }
    Object.assign(useState, Api, {
        *[Symbol.iterator] () {
            yield useState;
            yield Api;
        }
    });
    return useState;
}

function CommandBar({ store , onClose  }) {
    const { header , commands , active  } = store();
    const { Forms , Scrollers , Button  } = DiscordModules;
    return active ? /*#__PURE__*/ React.createElement("div", {
        className: "pc-command-list"
    }, /*#__PURE__*/ React.createElement(Forms.FormTitle, {
        tag: Forms.FormTitle.Tags.H5,
        className: "pc-commands-title"
    }, header, /*#__PURE__*/ React.createElement(Button, {
        look: Button.Looks.BLANK,
        size: Button.Sizes.NONE,
        onClick: onClose,
        className: "pc-commands-close"
    }, /*#__PURE__*/ React.createElement(DiscordIcon, {
        name: "Close"
    }))), /*#__PURE__*/ React.createElement(Scrollers.ScrollerThin, null, commands.map((cmd)=>/*#__PURE__*/ React.createElement("div", {
            className: "pc-command-row",
            "data-cmd": cmd.name,
            key: cmd.name,
            onClick: cmd.action
        }, cmd.name)
    ))) : null;
}

const DefaultMessage = {
    state: "SENT",
    author: {
        avatar: "__POWERCORD__",
        id: "94762492923748352",
        bot: true,
        discriminator: "#0001",
        username: "powerCord"
    },
    content: "Message."
};
promise.then(()=>{
    const { AvatarDefaults  } = DiscordModules;
    if (!AvatarDefaults) return;
    AvatarDefaults.BOT_AVATARS["__POWERCORD__"] = "https://cdn.discordapp.com/avatars/518171798513254407/665fe74ee3fbf58b9d5949d7e15dbafa.webp";
});
class Clyde {
    static sendMessage(channelId = DiscordModules.SelectedChannelStore.getChannelId(), message) {
        const { MessageActions , MessageCreators , Lodash  } = DiscordModules;
        MessageActions.receiveMessage(channelId, Lodash.merge({
        }, MessageCreators.createBotMessage(channelId, message === null || message === void 0 ? void 0 : message.content), DefaultMessage, message));
    }
}

const Logger$8 = Logger$b.create("Commands");
const [useCommandsStore, CommandsApi] = createStore({
    header: "",
    active: false,
    commands: []
});
const commands = new Map();
const optionsRegex = /"(.+?)"/g;
const section = {
    id: "powercord",
    type: 1,
    name: "Powercord",
    icon: "__POWERCORD__"
};
function resetRow() {
    CommandsApi.setState({
        active: false,
        commands: [],
        header: ""
    });
}
function initialize() {
    const [AssetUtils, CommandUtils, { AUTOCOMPLETE_OPTIONS  }] = Webpack.findByProps([
        "getApplicationIconURL"
    ], [
        "useApplicationCommandsDiscoveryState"
    ], [
        "AUTOCOMPLETE_OPTIONS"
    ], {
        bulk: true
    });
    Patcher.after("PowercordCommands", AssetUtils, "getApplicationIconURL", (_, [props])=>{
        if (props.icon === "__POWERCORD__") return "https://cdn.discordapp.com/attachments/891039688352219198/908403940738093106/46755359.png";
    });
    Patcher.after("PowercordCommands", CommandUtils, "useApplicationCommandsDiscoveryState", (_, __, returnValue)=>{
        const cmds = [
            ...commands.values()
        ];
        if (!returnValue.discoverySections.find((d)=>d.key == section.id
        )) {
            returnValue.applicationCommandSections.unshift(section);
            returnValue.discoveryCommands.unshift(...cmds);
            returnValue.commands.unshift(...cmds.filter((cmd)=>!returnValue.commands.some((e)=>e.name === cmd.name
                )
            ));
            returnValue.discoverySections.unshift({
                data: cmds,
                key: section.id,
                section
            });
            returnValue.sectionsOffset.unshift(commands.size);
        }
    });
    Patcher.after("PowercordCommands", AUTOCOMPLETE_OPTIONS.COMMANDS, 'queryResults', (_this, [, , query], res)=>{
        if (query == "") return res;
        const matches = [
            ...commands.keys()
        ].filter((c)=>c.toLowerCase().startsWith(query.toLowerCase())
        );
        return {
            results: {
                commands: [
                    ...res.results.commands,
                    ...matches.map((c)=>commands.get(c)
                    )
                ].filter(Boolean)
            }
        };
    });
}
function registerCommand(options) {
    const { command: command1 , executor , ...cmd } = options;
    // if (cmd.autocomplete) return Logger.warn("Commands", "Custom autocomplete is not supported yet!");
    const cmdOptions = matchAll(optionsRegex, cmd.usage).map(([name])=>({
            type: 3,
            name: name.slice(1, -1)
        })
    );
    cmdOptions.push({
        type: 3,
        required: false,
        name: "args"
    });
    commands.set(command1, {
        type: 3,
        target: 1,
        id: command1,
        name: command1,
        __powercord: true,
        execute: (result)=>{
            try {
                var ref;
                const args = (ref = Object.values(result).map((e)=>e[0].text
                )) !== null && ref !== void 0 ? ref : [];
                if (typeof cmd.autocomplete === "function") {
                    var ref1;
                    const cmds = cmd.autocomplete(args);
                    if (!(cmds === null || cmds === void 0 ? void 0 : (ref1 = cmds.commands) === null || ref1 === void 0 ? void 0 : ref1.length)) return;
                    var _header;
                    CommandsApi.setState({
                        active: true,
                        commands: cmds.commands.map(({ command  })=>{
                            return {
                                name: command,
                                action: ()=>{
                                    resetRow();
                                    try {
                                        const res = executor([
                                            command
                                        ]);
                                        if (res === null || res === void 0 ? void 0 : res.result) {
                                            Clyde.sendMessage(void 0, {
                                                content: res.result
                                            });
                                        }
                                    } catch (error) {
                                        Logger$8.error(`Could not executor for ${options.command}-${command}:`, error);
                                        Clyde.sendMessage(void 0, {
                                            content: ":x: An error occurred while running this command. Check your console."
                                        });
                                    }
                                }
                            };
                        }),
                        header: (_header = cmds.header) !== null && _header !== void 0 ? _header : "result:"
                    });
                } else {
                    executor(args);
                }
            } catch (error) {
                Logger$8.error(error);
            }
        },
        applicationId: section.id,
        options: cmdOptions,
        ...cmd
    });
}
function unregisterCommand(id) {
    commands.delete(id);
}
Webpack.whenReady.then(()=>{
    const ChannelChatMemo = Webpack.findModule((m)=>{
        var ref;
        return (m === null || m === void 0 ? void 0 : (ref = m.type) === null || ref === void 0 ? void 0 : ref.toString().indexOf("useAndTrackNonFriendDMAccept")) > -1;
    });
    if (!ChannelChatMemo) return void Logger$8.warn("Commands", "ChannelChat memo component not found!");
    const unpatch = Patcher.after("Commands", ChannelChatMemo, "type", (_, __, returnValue1)=>{
        unpatch();
        const ChannelChat = returnValue1.type;
        if (!ChannelChat) return void Logger$8.error("Commands", "Could no extract ChannelChat nested command!");
        Patcher.after("Commands", ChannelChat.prototype, "render", (_, __, returnValue)=>{
            var ref, ref2;
            const form = (ref = findInReactTree(returnValue, (n)=>{
                return (n === null || n === void 0 ? void 0 : n.type) === "form";
            })) === null || ref === void 0 ? void 0 : (ref2 = ref.props) === null || ref2 === void 0 ? void 0 : ref2.children;
            if (!Array.isArray(form)) return returnValue;
            form === null || form === void 0 ? void 0 : form.unshift(React.createElement(CommandBar, {
                store: useCommandsStore,
                onClose: resetRow
            }));
        });
    });
});

var commands$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    commands: commands,
    optionsRegex: optionsRegex,
    section: section,
    resetRow: resetRow,
    initialize: initialize,
    registerCommand: registerCommand,
    unregisterCommand: unregisterCommand
});

promise.then(()=>{
    const { LocaleManager , LocaleStore  } = DiscordModules;
    locale = LocaleManager.getLocale();
    LocaleStore.addChangeListener(()=>{
        if (LocaleStore.locale !== locale) {
            locale = LocaleStore.locale;
            LocaleManager.loadPromise.then(injectStrings);
        }
    });
    injectStrings();
});
let messages = {
};
let locale = null;
function loadAllStrings(strings) {
    for(let locale1 in strings){
        loadStrings(locale1, strings[locale1]);
    }
}
function loadStrings(locale, strings) {
    if (!messages[locale]) messages[locale] = {
    };
    Object.assign(messages[locale], strings);
    injectStrings();
}
function injectStrings() {
    if (!DiscordModules.LocaleManager) return;
    const context = DiscordModules.LocaleManager._provider._context;
    Object.assign(context.messages, messages[locale]);
    Object.assign(context.defaultMessages, messages["en-US"]);
}

var i18n = /*#__PURE__*/Object.freeze({
    __proto__: null,
    messages: messages,
    get locale () { return locale; },
    loadAllStrings: loadAllStrings,
    loadStrings: loadStrings,
    injectStrings: injectStrings
});

class DOM {
    static get head() {
        return memoize(this, "head", document.head.appendChild(this.createElement("pc-head")));
    }
    static createElement(type, options = {
    }, ...children) {
        const node = Object.assign(document.createElement(type), options);
        node.append(...children);
        return node;
    }
    static injectCSS(id, cssOrURL, options) {
        var ref;
        switch((ref = options === null || options === void 0 ? void 0 : options.type) !== null && ref !== void 0 ? ref : "PLAIN"){
            case "PLAIN":
                var element = this.createElement("style", {
                    id,
                    textContent: cssOrURL
                });
                break;
            case "URL":
                var element = this.createElement("link", {
                    rel: "stylesheet",
                    href: cssOrURL
                });
                break;
        }
        ((options === null || options === void 0 ? void 0 : options.documentHead) ? document.head : this.head).appendChild(element);
        this.elements[id] = element;
        return element;
    }
    static injectJS(id, url, options) {
        return new Promise((resolve, reject)=>{
            const script = this.createElement("script", {
                id,
                src: url,
                onload: resolve,
                onerror: reject
            });
            ((options === null || options === void 0 ? void 0 : options.documentHead) ? document.head : this.head).appendChild(script);
            this.elements[id] = script;
        });
    }
    static getElement(id) {
        return this.elements[id] || this.head.querySelector(`style[id="${id}"]`);
    }
    static clearCSS(id) {
        const element = this.getElement(id);
        if (element) element.remove();
        delete this.elements[id];
    }
}
DOM.elements = {
};

const Logger$7 = Logger$b.create("FLuxDispatcher");
function createDispatcher() {
    const events = {
    };
    const API = {
        events: events,
        emit (event) {
            if (!events[event === null || event === void 0 ? void 0 : event.type]) return;
            for (const callback of events[event.type]){
                try {
                    callback(event);
                } catch (error) {
                    Logger$7.error(`Could not fire callback for ${event}:`, error);
                }
            }
        },
        on (event, callback) {
            if (!events[event]) events[event] = new Set();
            events[event].add(callback);
            return ()=>API.off(event, callback)
            ;
        },
        off (event, callback) {
            if (!events[event]) return;
            return events[event].delete(callback);
        },
        once (event1, callback) {
            const unsubscribe = API.on(event1, (event)=>{
                unsubscribe();
                return Reflect.apply(callback, null, [
                    event
                ]);
            });
            return unsubscribe;
        },
        useComponentDispatch: function useComponentDispatch(event, callback) {
            DiscordModules.React.useEffect(()=>API.on(event, callback)
            );
        }
    };
    return API;
}

function _extends$Q() {
    _extends$Q = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$Q.apply(this, arguments);
}
var Bin = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$Q({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 25 21"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M1.60772 16C1.60772 17.1 2.49904 18 3.58843 18H11.5112C12.6006 18 13.4919 17.1 13.4919 16V6C13.4919 4.9 12.6006 4 11.5112 4H3.58843C2.49904 4 1.60772 4.9 1.60772 6V16ZM4.74714 8.17C4.83876 8.0773 4.94759 8.00375 5.06739 7.95357C5.1872 7.90339 5.31563 7.87756 5.44534 7.87756C5.57504 7.87756 5.70347 7.90339 5.82328 7.95357C5.94309 8.00375 6.05191 8.0773 6.14354 8.17L7.54984 9.59L8.95614 8.17C9.04782 8.07742 9.15667 8.00398 9.27647 7.95387C9.39627 7.90377 9.52467 7.87798 9.65433 7.87798C9.784 7.87798 9.9124 7.90377 10.0322 7.95387C10.152 8.00398 10.2608 8.07742 10.3525 8.17C10.4442 8.26258 10.517 8.37249 10.5666 8.49346C10.6162 8.61442 10.6417 8.74407 10.6417 8.875C10.6417 9.00593 10.6162 9.13558 10.5666 9.25654C10.517 9.37751 10.4442 9.48742 10.3525 9.58L8.94623 11L10.3525 12.42C10.4442 12.5126 10.517 12.6225 10.5666 12.7435C10.6162 12.8644 10.6417 12.9941 10.6417 13.125C10.6417 13.2559 10.6162 13.3856 10.5666 13.5065C10.517 13.6275 10.4442 13.7374 10.3525 13.83C10.2608 13.9226 10.152 13.996 10.0322 14.0461C9.9124 14.0962 9.784 14.122 9.65433 14.122C9.52467 14.122 9.39627 14.0962 9.27647 14.0461C9.15667 13.996 9.04782 13.9226 8.95614 13.83L7.54984 12.41L6.14354 13.83C6.05185 13.9226 5.943 13.996 5.8232 14.0461C5.7034 14.0962 5.575 14.122 5.44534 14.122C5.31567 14.122 5.18727 14.0962 5.06747 14.0461C4.94768 13.996 4.83883 13.9226 4.74714 13.83C4.65545 13.7374 4.58272 13.6275 4.5331 13.5065C4.48348 13.3856 4.45794 13.2559 4.45794 13.125C4.45794 12.9941 4.48348 12.8644 4.5331 12.7435C4.58272 12.6225 4.65545 12.5126 4.74714 12.42L6.15344 11L4.74714 9.58C4.65533 9.48749 4.58249 9.3776 4.53279 9.25662C4.4831 9.13565 4.45752 9.00597 4.45752 8.875C4.45752 8.74403 4.4831 8.61435 4.53279 8.49338C4.58249 8.3724 4.65533 8.26251 4.74714 8.17ZM11.0161 1L10.3129 0.29C10.1347 0.11 9.87716 0 9.61967 0H5.48C5.22251 0 4.96502 0.11 4.78675 0.29L4.0836 1H1.60772C1.06303 1 0.617371 1.45 0.617371 2C0.617371 2.55 1.06303 3 1.60772 3H13.4919C14.0366 3 14.4823 2.55 14.4823 2C14.4823 1.45 14.0366 1 13.4919 1H11.0161Z"
    })));
});

function _extends$P() {
    _extends$P = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$P.apply(this, arguments);
}
var Bulb = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$P({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2",
        d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    })));
});

function _extends$O() {
    _extends$O = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$O.apply(this, arguments);
}
var Chemistry = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$O({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 640 1024"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M618 971L448 769V416h21q14 0 23-9.5t9-23t-9-22.5t-23-9h-53q-13 0-22.5 9t-9.5 23v397q0 13 8 22l131 157H117l131-157q8-9 8-22V384q0-14-9.5-23t-22.5-9h-53q-14 0-23 9t-9 22.5t9 23t23 9.5h21v353L22 971q-14 15-6 34q4 9 12 14t17 5h550q20 0 28.5-19t-5.5-34zM288 320q26 0 45-19t19-45.5t-19-45t-45-18.5q-13 0-25 5t-20.5 13.5T229 231t-5 25q0 6 1 11.5t3 10.5t5 10t6.5 9t7.5 7.5t9 6.5t10 5t10.5 3t11.5 1zm208.5-95q46.5 0 79.5-33t33-79.5T576 33T496.5 0T417 33t-33 79.5t33 79.5t79.5 33zM496 64q10 0 19 3.5t15.5 10t10 15.5t3.5 19q0 20-14 34t-34 14q-13 0-24-6.5T454.5 136t-6.5-24q0-20 14-34t34-14z"
    })));
});

function _extends$N() {
    _extends$N = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$N.apply(this, arguments);
}
var Clear = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$N({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 14 14"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M7.02799 0.333252C3.346 0.333252 0.361328 3.31792 0.361328 6.99992C0.361328 10.6819 3.346 13.6666 7.02799 13.6666C10.71 13.6666 13.6947 10.6819 13.6947 6.99992C13.6947 3.31792 10.7093 0.333252 7.02799 0.333252ZM10.166 9.19525L9.22333 10.1379L7.02799 7.94325L4.83266 10.1379L3.89 9.19525L6.08466 6.99992L3.88933 4.80459L4.832 3.86259L7.02733 6.05792L9.22266 3.86259L10.1653 4.80459L7.97066 6.99992L10.166 9.19525Z"
    })));
});

function _extends$M() {
    _extends$M = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$M.apply(this, arguments);
}
var Close = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$M({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 12 12"
    }, props), /*#__PURE__*/ React.createElement("g", {
        fill: "currentColor"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"
    }))));
});

function _extends$L() {
    _extends$L = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$L.apply(this, arguments);
}
var CloudDownload = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$L({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 25 21"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2",
        d: "M8.59741 15.0117L12.5588 19.0117L16.5202 15.0117 M12.5588 10.0117V19.0117 M21.3531 16.1017C22.2141 15.4903 22.8598 14.6178 23.1965 13.6108C23.5331 12.6038 23.5432 11.5147 23.2253 10.5015C22.9074 9.48829 22.278 8.60374 21.4285 7.97621C20.5789 7.34869 19.5535 7.01082 18.5009 7.01165H17.2531C16.9552 5.83953 16.3979 4.7509 15.6231 3.82773C14.8482 2.90456 13.8761 2.17091 12.7798 1.68201C11.6836 1.1931 10.4918 0.961679 9.2941 1.00517C8.09645 1.04866 6.92417 1.36592 5.86552 1.93308C4.80688 2.50023 3.88944 3.3025 3.18229 4.27948C2.47514 5.25646 1.99671 6.3827 1.783 7.5734C1.56929 8.76411 1.62588 9.98825 1.9485 11.1537C2.27113 12.3191 2.85139 13.3954 3.64559 14.3017"
    })));
});

function _extends$K() {
    _extends$K = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$K.apply(this, arguments);
}
var CloudUpload = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$K({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "none",
        d: "M0 0h24v24H0z"
    }), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
    })));
});

function _extends$J() {
    _extends$J = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$J.apply(this, arguments);
}
var CodeBraces = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$J({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-8 5H9v2c0 1.1-.9 2-2 2c1.1 0 2 .9 2 2v2h2v2H9c-1.1 0-2-.9-2-2v-1c0-1.1-.9-2-2-2v-2c1.1 0 2-.9 2-2V8c0-1.1.9-2 2-2h2v2m8 5c-1.1 0-2 .9-2 2v1c0 1.1-.9 2-2 2h-2v-2h2v-2c0-1.1.9-2 2-2c-1.1 0-2-.9-2-2V8h-2V6h2c1.1 0 2 .9 2 2v1c0 1.1.9 2 2 2v2z"
    })));
});

function _extends$I() {
    _extends$I = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$I.apply(this, arguments);
}
var Copy = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$I({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("g", {
        fill: "currentColor"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z M15 5H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"
    }))));
});

function _extends$H() {
    _extends$H = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$H.apply(this, arguments);
}
var Discord = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$H({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 245 240"
    }, props), /*#__PURE__*/ React.createElement("g", {
        fill: "currentColor"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"
    }))));
});

function _extends$G() {
    _extends$G = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$G.apply(this, arguments);
}
var ExternalLink = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$G({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z"
    })));
});

function _extends$F() {
    _extends$F = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$F.apply(this, arguments);
}
var Gear = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$F({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
    })));
});

function _extends$E() {
    _extends$E = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$E.apply(this, arguments);
}
var GitHub = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$E({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2px",
        d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
    })));
});

function _extends$D() {
    _extends$D = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$D.apply(this, arguments);
}
var ImportExport = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$D({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35c-.19-.19-.51-.19-.7 0z"
    })));
});

function _extends$C() {
    _extends$C = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$C.apply(this, arguments);
}
var Info = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$C({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("g", {
        fill: "none",
        "fill-rule": "evenodd"
    }, /*#__PURE__*/ React.createElement("rect", {
        width: "24",
        height: "24"
    }), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M9,7 L11,7 L11,5 L9,5 L9,7 Z M10,18 C5.59,18 2,14.41 2,10 C2,5.59 5.59,2 10,2 C14.41,2 18,5.59 18,10 C18,14.41 14.41,18 10,18 L10,18 Z M10,4.4408921e-16 C4.4771525,-1.77635684e-15 4.4408921e-16,4.4771525 0,10 C-1.33226763e-15,12.6521649 1.0535684,15.195704 2.92893219,17.0710678 C4.80429597,18.9464316 7.3478351,20 10,20 C12.6521649,20 15.195704,18.9464316 17.0710678,17.0710678 C18.9464316,15.195704 20,12.6521649 20,10 C20,7.3478351 18.9464316,4.80429597 17.0710678,2.92893219 C15.195704,1.0535684 12.6521649,2.22044605e-16 10,0 L10,4.4408921e-16 Z M9,15 L11,15 L11,9 L9,9 L9,15 L9,15 Z",
        transform: "translate(2 2)"
    }))));
});

function _extends$B() {
    _extends$B = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$B.apply(this, arguments);
}
var Key = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$B({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
    })));
});

function _extends$A() {
    _extends$A = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$A.apply(this, arguments);
}
var Keyboard = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$A({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm8 7H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm1-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"
    })));
});

function _extends$z() {
    _extends$z = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$z.apply(this, arguments);
}
var Overflow = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$z({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z"
    })));
});

function _extends$y() {
    _extends$y = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$y.apply(this, arguments);
}
var Person = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$y({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    })));
});

function _extends$x() {
    _extends$x = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$x.apply(this, arguments);
}
var PersonShield = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$x({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 23"
    }, props), /*#__PURE__*/ React.createElement("g", {
        fill: "none",
        "fill-rule": "evenodd"
    }, /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M19.487 5.126L10.487 0.126C10.184 -0.042 9.81798 -0.042 9.51498 0.126L0.514977 5.126C0.197977 5.302 0.000976562 5.636 0.000976562 5.999C0.000976562 6.693 0.114977 22.999 10.001 22.999C19.887 22.999 20.001 6.693 20.001 5.999C20.001 5.636 19.804 5.302 19.487 5.126ZM10.001 5.999C11.382 5.999 12.501 7.118 12.501 8.499C12.501 9.88 11.382 10.999 10.001 10.999C8.61998 10.999 7.50098 9.88 7.50098 8.499C7.50098 7.118 8.61998 5.999 10.001 5.999ZM6.25098 16C6.25098 13.699 7.69998 12.25 10.001 12.25C12.302 12.25 13.751 13.699 13.751 16H6.25098Z"
    }))));
});

function _extends$w() {
    _extends$w = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$w.apply(this, arguments);
}
var Pin = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$w({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M19 3H5V5H7V12H5V14H11V22H13V14H19V12H17V5H19V3Z"
    })));
});

function _extends$v() {
    _extends$v = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$v.apply(this, arguments);
}
var Plugin = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$v({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"
    })));
});

function _extends$u() {
    _extends$u = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$u.apply(this, arguments);
}
var Receipt = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$u({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 18 20"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M15 15H3V13H15Zm0-4H3V9H15Zm0-4H3V5H15ZM0 20l1.5-1.5L3 20l1.5-1.5L6 20l1.5-1.5L9 20l1.5-1.5L12 20l1.5-1.5L15 20l1.5-1.5L18 20V0L16.5 1.5 15 0 13.5 1.5 12 0 10.5 1.5 9 0 7.5 1.5 6 0 4.5 1.5 3 0 1.5 1.5 0 0Z"
    })));
});

function _extends$t() {
    _extends$t = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$t.apply(this, arguments);
}
var ReportFlag = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$t({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M3 2.001h2v20H3zM20 6.002h-5v-3c0-.552-.447-1-1-1H7c-.553 0-1 .448-1 1v10c0 .552.447 1 1 1h5l-1.8 2.4c-.227.303-.265.708-.095 1.047.17.339.516.553.894.553h9c.553 0 1-.448 1-1v-10c.001-.552-.446-1-.999-1z"
    })));
});

function _extends$s() {
    _extends$s = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$s.apply(this, arguments);
}
var Scale = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$s({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 48 48"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M26 30C26 35.524 30.476 40 36 40C41.524 40 46 35.524 46 30H26Z M12 40C17.524 40 22 35.524 22 30H2C2 35.524 6.476 40 12 40Z M26 16V14H33.312L29.112 28H33.29L36 18.962L38.71 28H42.888L38.688 14H44V10H26V6H22V10H4V14H9.312L5.112 28H9.288L12 18.962L14.712 28H18.888L14.688 14H22V16H26Z"
    })));
});

function _extends$r() {
    _extends$r = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$r.apply(this, arguments);
}
var Search = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$r({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"
    })));
});

function _extends$q() {
    _extends$q = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$q.apply(this, arguments);
}
var Server = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$q({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M13 19h1a1 1 0 0 1 1 1h7v2h-7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1H2v-2h7a1 1 0 0 1 1-1h1v-2H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-7v2M4 3h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m5 4h1V5H9v2m0 8h1v-2H9v2M5 5v2h2V5H5m0 8v2h2v-2H5z"
    })));
});

function _extends$p() {
    _extends$p = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$p.apply(this, arguments);
}
var Spotify = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$p({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
    })));
});

function _extends$o() {
    _extends$o = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$o.apply(this, arguments);
}
var Sync = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$o({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6c0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6c0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4l-4-4v3z"
    })));
});

function _extends$n() {
    _extends$n = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$n.apply(this, arguments);
}
var Tag = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$n({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M21.707 13.293l-11-11C10.519 2.105 10.266 2 10 2H3c-.553 0-1 .447-1 1v7c0 .266.105.519.293.707l11 11c.195.195.451.293.707.293s.512-.098.707-.293l7-7c.391-.391.391-1.023 0-1.414zM7 9c-1.106 0-2-.896-2-2 0-1.106.894-2 2-2 1.104 0 2 .894 2 2 0 1.104-.896 2-2 2z"
    })));
});

function _extends$m() {
    _extends$m = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$m.apply(this, arguments);
}
var Theme = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$m({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"
    })));
});

function _extends$l() {
    _extends$l = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$l.apply(this, arguments);
}
var ThumbsDown = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$l({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 15 12"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M9.33333 0H3.33333C2.78 0 2.30667 0.333333 2.10667 0.813333L0.0933333 5.51333C0.0333333 5.66667 0 5.82667 0 6V7.33333C0 8.06667 0.6 8.66667 1.33333 8.66667H5.54L4.90667 11.7133L4.88667 11.9267C4.88667 12.2 5 12.4533 5.18 12.6333L5.88667 13.3333L10.28 8.94C10.52 8.7 10.6667 8.36667 10.6667 8V1.33333C10.6667 0.6 10.0667 0 9.33333 0ZM12 0V8H14.6667V0H12Z"
    })));
});

function _extends$k() {
    _extends$k = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$k.apply(this, arguments);
}
var ThumbsUp = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$k({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 15 14"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M0 13.3333H2.66667V5.33333H0V13.3333ZM14.6667 6C14.6667 5.26667 14.0667 4.66667 13.3333 4.66667H9.12667L9.76 1.62L9.78 1.40667C9.78 1.13333 9.66667 0.88 9.48667 0.7L8.78 0L4.39333 4.39333C4.14667 4.63333 4 4.96667 4 5.33333V12C4 12.7333 4.6 13.3333 5.33333 13.3333H11.3333C11.8867 13.3333 12.36 13 12.56 12.52L14.5733 7.82C14.6333 7.66667 14.6667 7.50667 14.6667 7.33333V6Z"
    })));
});

function _extends$j() {
    _extends$j = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$j.apply(this, arguments);
}
var Unlink = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$j({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M21.94 11.23C21.57 8.76 19.32 7 16.82 7h-2.87c-.52 0-.95.43-.95.95s.43.95.95.95h2.9c1.6 0 3.04 1.14 3.22 2.73.17 1.43-.64 2.69-1.85 3.22l1.4 1.4c1.63-1.02 2.64-2.91 2.32-5.02zM4.12 3.56c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l2.4 2.4c-1.94.8-3.27 2.77-3.09 5.04C2.23 15.05 4.59 17 7.23 17h2.82c.52 0 .95-.43.95-.95s-.43-.95-.95-.95H7.16c-1.63 0-3.1-1.19-3.25-2.82-.15-1.72 1.11-3.17 2.75-3.35l2.1 2.1c-.43.09-.76.46-.76.92v.1c0 .52.43.95.95.95h1.78L13 15.27V17h1.73l3.3 3.3c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.12 3.56zM16 11.95c0-.52-.43-.95-.95-.95h-.66l1.49 1.49c.07-.13.12-.28.12-.44v-.1z"
    })));
});

function _extends$i() {
    _extends$i = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$i.apply(this, arguments);
}
var Unpin = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$i({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24"
    }, props), /*#__PURE__*/ React.createElement("g", {
        fill: "none",
        fillRule: "evenodd"
    }, /*#__PURE__*/ React.createElement("path", {
        fill: "#f04747",
        d: "M21.47,3.39,20.14,2.05,2.53,19.66,3.86,21l4.41-4.4,1.3-1.31,1.75-1.74,3.83-3.83Z"
    })), /*#__PURE__*/ React.createElement("g", {
        fill: "none"
    }, /*#__PURE__*/ React.createElement("polygon", {
        points: "17 11.14 16.55 11.59 14.14 14 19 14 19 12 17 12 17 11.14",
        fill: "currentColor"
    }), /*#__PURE__*/ React.createElement("polygon", {
        points: "16.91 3 5 3 5 5 7 5 7 12 5 12 5 14 5.91 14 16.91 3",
        fill: "currentColor"
    }), /*#__PURE__*/ React.createElement("polygon", {
        points: "12.72 15.42 11 17.14 11 22 13 22 13 15.14 12.72 15.42",
        fill: "currentColor"
    }))));
});

function _extends$h() {
    _extends$h = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$h.apply(this, arguments);
}
var Verified = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$h({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M14.5,5.6c-0.2-0.8,0.5-2,0-2.6C14,2.3,12.6,2.6,12,2.2s-0.8-1.9-1.5-2.1C9.8-0.1,8.8,0.9,8,0.9S6.3-0.2,5.5,0 C4.8,0.3,4.6,1.7,4,2.2S2,2.4,1.5,3c-0.4,0.6,0.2,1.9,0,2.6C1.3,6.3,0,6.9,0,7.6C0,8.4,1.3,9,1.5,9.7c0.2,0.8-0.5,2,0,2.6 C2,12.9,3.4,12.7,4,13.1s0.8,1.9,1.5,2.1c0.7,0.2,1.7-0.8,2.5-0.8s1.7,1,2.5,0.8s0.9-1.6,1.5-2.1s2-0.2,2.5-0.8 c0.4-0.6-0.2-1.9,0-2.6S16,8.4,16,7.6C16,6.9,14.7,6.3,14.5,5.6z M7.4,11.2L4,8.7l1-1.4l2,1.5L10.6,4L12,5L7.4,11.2z"
    })));
});

function _extends$g() {
    _extends$g = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$g.apply(this, arguments);
}
var VerifiedBadge = ((props)=>{
    return(/*#__PURE__*/ React.createElement("svg", _extends$g({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "#4F545C",
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M16 7.64528C16 8.43528 14.72 9.02528 14.48 9.73528C14.24 10.4453 14.92 11.7353 14.48 12.3253C14.04 12.9153 12.64 12.6753 12.02 13.1253C11.4 13.5753 11.23 14.9653 10.48 15.2153C9.73 15.4653 8.81 14.4153 8.01 14.4153C7.21 14.4153 6.26 15.4153 5.54 15.2153C4.82 15.0153 4.62 13.5753 4 13.1253C3.38 12.6753 2 12.9453 1.54 12.3253C1.08 11.7053 1.77 10.4853 1.54 9.73528C1.31 8.98528 0 8.43528 0 7.64528C0 6.85528 1.28 6.26528 1.52 5.55528C1.76 4.84528 1.08 3.55528 1.52 2.96528C1.96 2.37528 3.37 2.61528 4 2.16528C4.63 1.71528 4.78 0.325284 5.53 0.0452838C6.28 -0.234716 7.2 0.875284 8 0.875284C8.8 0.875284 9.75 -0.124716 10.47 0.0752838C11.19 0.275284 11.38 1.71528 12 2.16528C12.62 2.61528 14 2.34528 14.46 2.96528C14.92 3.58528 14.23 4.80528 14.46 5.55528C14.69 6.30528 16 6.85528 16 7.64528Z"
    }), /*#__PURE__*/ React.createElement("path", {
        fill: "white",
        d: "M7.4 11.2153L4 8.66529L5 7.30529L7 8.83529L10.64 4.04529L12 5.04529L7.4 11.2153Z"
    })));
});

const styles = [
    "regular",
    "light",
    "duotone",
    "brands"
];
const stylePrefixes = [
    "far",
    "fal",
    "fad",
    "fab"
];
var FontAwesome = ((props)=>{
    const style1 = styles.find((style)=>style === props.icon.split(" ")[0].match(/[a-z]+(?!.*-)/)[0]
    );
    var ref;
    const stylePrefix = (ref = stylePrefixes[styles.indexOf(style1)]) !== null && ref !== void 0 ? ref : "fas";
    const iconName = props.icon.replace(`-${style1}`, "");
    var _className;
    return(/*#__PURE__*/ React.createElement("span", {
        className: joinClassNames(stylePrefix, `fa-${iconName}`, (_className = props.className) !== null && _className !== void 0 ? _className : "").trim()
    }));
});

var Icons$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Bin: Bin,
    Bulb: Bulb,
    Chemistry: Chemistry,
    Clear: Clear,
    Close: Close,
    CloudDownload: CloudDownload,
    CloudUpload: CloudUpload,
    CodeBraces: CodeBraces,
    Copy: Copy,
    Discord: Discord,
    ExternalLink: ExternalLink,
    Gear: Gear,
    GitHub: GitHub,
    ImportExport: ImportExport,
    Info: Info,
    Key: Key,
    Keyboard: Keyboard,
    Overflow: Overflow,
    Person: Person,
    PersonShield: PersonShield,
    Pin: Pin,
    Plugin: Plugin,
    Receipt: Receipt,
    ReportFlag: ReportFlag,
    Scale: Scale,
    Search: Search,
    Server: Server,
    Spotify: Spotify,
    Sync: Sync,
    Tag: Tag,
    Theme: Theme,
    ThumbsDown: ThumbsDown,
    ThumbsUp: ThumbsUp,
    Unlink: Unlink,
    Unpin: Unpin,
    Verified: Verified,
    VerifiedBadge: VerifiedBadge,
    FontAwesome: FontAwesome
});

function _extends$f() {
    _extends$f = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$f.apply(this, arguments);
}
const [useNoticesStore, NoticesApi] = createStore({
    notices: {
    }
});
const Dispatcher = createDispatcher();
const types = {
    info: 'info-circle-regular',
    warning: 'exclamation-circle-regular',
    danger: 'times-circle-regular',
    success: 'check-circle-regular'
};
function Notice(props) {
    const { ReactSpring: { useSpring , animated  } , Button , Markdown  } = DiscordModules;
    const [closing, setClosing] = React.useState(false);
    if (props.type && types[props.type]) props.icon = types[props.type];
    const spring = useSpring({
        from: {
            progress: 0
        },
        to: {
            progress: 100
        },
        config: (key)=>{
            switch(key){
                case "progress":
                    return {
                        duration: props.timeout
                    };
                default:
                    return {
                        duration: 0
                    };
            }
        }
    });
    const startClosing = ()=>{
        spring.progress.set(100);
    };
    Dispatcher.useComponentDispatch("SET_CLOSING", (event)=>{
        if (event.all) setClosing(true);
        if (event.id !== props.id) return;
        startClosing();
    });
    React.useEffect(()=>{
        if (!closing) return;
        setTimeout(props.onClose, 380);
    }, [
        closing
    ]);
    return(/*#__PURE__*/ React.createElement(animated.div, {
        onMouseEnter: ()=>spring.progress.pause()
        ,
        onMouseLeave: ()=>spring.progress.resume()
        ,
        className: joinClassNames("pc-notice-container", [
            closing,
            "pc-notice-closing"
        ])
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-notice-header"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-notice-header-name"
    }, props.icon && /*#__PURE__*/ React.createElement(FontAwesome, {
        className: "pc-notice-icon",
        icon: props.icon
    }), props.header), /*#__PURE__*/ React.createElement(Button, {
        look: Button.Looks.BLANK,
        size: Button.Sizes.NONE,
        className: "pc-notice-close",
        onClick: ()=>setClosing(true)
        ,
        onContextMenu: ()=>Dispatcher.emit({
                type: "SET_CLOSING",
                all: true
            })
    }, /*#__PURE__*/ React.createElement(DiscordIcon, {
        name: "Close"
    }))), props.content && /*#__PURE__*/ React.createElement("div", {
        className: "pc-notice-content"
    }, typeof props.content === "string" ? /*#__PURE__*/ React.createElement(Markdown, null, props.content) : props.content), Array.isArray(props.buttons) && /*#__PURE__*/ React.createElement("div", {
        className: "pc-notice-footer"
    }, props.buttons.map((button, i)=>{
        var ref, ref1, ref2;
        return button && /*#__PURE__*/ React.createElement(Button, {
            color: Button.Colors[(ref = (ref = button.color) === null || ref === void 0 ? void 0 : ref.toUpperCase()) !== null && ref !== void 0 ? ref : "BRAND_NEW"],
            look: Button.Looks[((ref1 = button.look) === null || ref1 === void 0 ? void 0 : ref1.toUpperCase()) || "FILLED"],
            size: Button.Sizes[((ref2 = button.size) === null || ref2 === void 0 ? void 0 : ref2.toUpperCase()) || "MIN"],
            onClick: button.onClick,
            key: "button-" + i,
            className: "pc-notice-button"
        }, button.text);
    })), props.timeout > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "pc-notice-progress"
    }, /*#__PURE__*/ React.createElement(animated.div, {
        className: "pc-notice-progress-bar",
        style: {
            width: spring.progress.to((e)=>{
                if (e > 97 && props.timeout !== 0 && !closing) {
                    setClosing(true);
                }
                return `${e}%`;
            })
        }
    }))));
}
function NoticesContainer() {
    const notices = useNoticesStore((s)=>Object.entries(s.notices)
    );
    return(/*#__PURE__*/ React.createElement(ErrorBoundary, null, notices.map(([id, notice])=>/*#__PURE__*/ React.createElement(Notice, _extends$f({
            id: id
        }, notice, {
            key: id
        }))
    )));
}
class Notices {
    static initialize() {
        const { ReactDOM  } = DiscordModules;
        ReactDOM.render(/*#__PURE__*/ React.createElement(NoticesContainer, null), this.container);
        document.body.appendChild(this.container);
    }
    static show(options) {
        const state = NoticesApi.getState();
        if (state.notices[options.id]) throw new Error(`Notice with id ${options.id} already exists!`);
        NoticesApi.setState({
            notices: {
                ...state.notices,
                [options.id]: {
                    ...options,
                    onClose: ()=>{
                        this.remove(options.id);
                    }
                }
            }
        });
    }
    static close(id) {
        const state = NoticesApi.getState();
        if (!state.notices[id]) throw new Error(`Notice with id ${id} already exists!`);
        Dispatcher.emit({
            type: "SET_CLOSING",
            id: id
        });
    }
    static remove(id) {
        const state = NoticesApi.getState();
        if (!state.notices[id]) throw new Error(`Notice with id ${id} already exists!`);
        delete state.notices[id];
        NoticesApi.setState({
            notices: {
                ...state.notices
            }
        });
    }
}
Notices.container = DOM.createElement("div", {
    className: "pc-notices"
});
promise.then(()=>Notices.initialize()
);

const Logger$6 = Logger$b.create("Notices:Announcement");
var Announcement = fromPromise(promise.then(()=>{
    const Notices = Webpack.findModule((m)=>{
        var ref;
        return ((ref = m.default) === null || ref === void 0 ? void 0 : ref.displayName) === "Notice";
    });
    const NoticeCloseButton = Notices.NoticeCloseButton;
    const NoticeButtonAncor = Notices.NoticeButton;
    const Notice = Notices.default;
    const Colors = {
        BLURPLE: Notices.NoticeColors.BRAND,
        RED: Notices.NoticeColors.DANGER,
        ORANGE: Notices.NoticeColors.DEFAULT,
        BLUE: Notices.NoticeColors.INFO,
        GREY: Notices.NoticeColors.NEUTRAL,
        DARK_GREY: Notices.NoticeColors.DARK,
        GREEN: Notices.NoticeColors.NOTIFICATION,
        BLURPLE_GRADIENT_1: Notices.NoticeColors.PREMIUM_TIER_1,
        BLURPLE_GRADIENT_2: Notices.NoticeColors.PREMIUM_TIER_2,
        SPOTIFY: Notices.NoticeColors.SPOTIFY,
        PURPLE: Notices.NoticeColors.STREAMER_MODE
    };
    return function Announcement(props) {
        var ref;
        const handleClick = function(callback) {
            try {
                closeAnnouncement(props.id);
                if (callback && typeof callback === "function") {
                    return callback();
                }
            } catch (err) {
                return Logger$6.error(err);
            }
        };
        var ref1;
        return(/*#__PURE__*/ React.createElement(Notice, {
            color: (ref1 = Colors[(ref = props.color) === null || ref === void 0 ? void 0 : ref.toUpperCase()]) !== null && ref1 !== void 0 ? ref1 : Colors.BLURPLE,
            id: props.id
        }, /*#__PURE__*/ React.createElement(NoticeCloseButton, {
            onClick: ()=>handleClick(props.callback)
        }), props.message, props.button && /*#__PURE__*/ React.createElement(NoticeButtonAncor, {
            onClick: ()=>handleClick(props.button.onClick)
        }, props.button.text)));
    };
}));

function _extends$e() {
    _extends$e = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$e.apply(this, arguments);
}
const useAnnouncements = createStore({
    elements: {
    }
});
const AnnouncementsStore = useAnnouncements;
function AnnouncementContainer({ store: useAnnouncements1  }) {
    const elements = useAnnouncements1((state)=>state.elements
    );
    return(/*#__PURE__*/ React.createElement(React.Fragment, null, Object.values(elements).map((notice)=>/*#__PURE__*/ React.createElement(Announcement, _extends$e({
        }, notice, {
            key: notice.id
        }))
    )));
}

const Logger$5 = Logger$b.create("Announcements");
const [useAnnouncementsStore, AnnouncementsApi] = AnnouncementsStore;
const patchClassNames = function() {
    const noticeClasses = Webpack.findByProps("notice", "colorDefault", "buttonMinor");
    noticeClasses.notice += " powercord-announcement";
};
const patchNoticeContainer = async function() {
    var ref;
    var ref1;
    const { base  } = (ref1 = Webpack.findByProps("base", "container")) !== null && ref1 !== void 0 ? ref1 : {
        base: "pc-not-found"
    };
    const instance = getOwnerInstance(await waitFor(`.${base.split(" ")[0]}`));
    Patcher.after("pc-compat-notices", instance === null || instance === void 0 ? void 0 : (ref = instance.props) === null || ref === void 0 ? void 0 : ref.children, "type", (_, args, res)=>{
        try {
            const { children  } = findInReactTree(res, (r)=>r.className === base
            );
            children.unshift(/*#__PURE__*/ React.createElement(AnnouncementContainer, {
                store: useAnnouncementsStore
            }));
        } catch (error) {
            return Logger$5.error(error);
        }
    });
    instance.forceUpdate();
};
promise.then(()=>{
    patchClassNames();
    patchNoticeContainer();
}).catch((error)=>{
    Logger$5.error("Failed to initialize:", error);
});
function sendAnnouncement(id, options) {
    const state = AnnouncementsApi.getState();
    if (state.elements[id]) throw `Announcement with id ${id} already exists!`;
    AnnouncementsApi.setState({
        ...state,
        elements: {
            ...state.elements,
            [id]: {
                ...options,
                id
            }
        }
    });
}
function closeAnnouncement(id) {
    const state = AnnouncementsApi.getState();
    if (!state.elements[id]) return false;
    delete state.elements[id];
    AnnouncementsApi.setState(Object.assign({
    }, state));
}

function sendToast(id, options) {
    return Notices.show(Object.assign(options, {
        id
    }));
}
function closeToast(id) {
    return Notices.close(id);
}

var notices = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sendToast: sendToast,
    closeToast: closeToast,
    sendAnnouncement: sendAnnouncement,
    closeAnnouncement: closeAnnouncement
});

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    settings: settings$1,
    commands: commands$1,
    i18n: i18n,
    notices: notices
});

let ModalContext = null;
promise.then(()=>{
    ModalContext = DiscordModules.React.createContext(null);
});
function open(Component) {
    return DiscordModules.ModalsApi.openModal((props)=>{
        return React.createElement(ModalContext.Provider, {
            value: props
        }, React.createElement(Component, props));
    });
}
function close() {
    var ref, ref1, ref2, ref3, ref4;
    const lastModal = (ref4 = (ref = DiscordModules.ModalsApi.useModalsStore) === null || ref === void 0 ? void 0 : (ref1 = ref.getState) === null || ref1 === void 0 ? void 0 : (ref2 = ref1.call(ref)) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.default) === null || ref3 === void 0 ? void 0 : ref3.slice(-1)[0]) === null || ref4 === void 0 ? void 0 : ref4.key;
    if (!lastModal) return;
    DiscordModules.ModalsApi.closeModal(lastModal);
}
function closeAll() {
    DiscordModules.ModalsApi.closeAllModals();
}

var modal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get ModalContext () { return ModalContext; },
    open: open,
    close: close,
    closeAll: closeAll
});

var components = {
    SwitchItem: {
        updater: true,
        filter: "SwitchItem",
        settings: true
    },
    Button: {
        updater: false,
        filter: [
            "DropdownSizes"
        ],
        settings: false
    },
    FormNotice: {
        updater: false,
        filter: "FormNotice",
        settings: false
    },
    Card: {
        updater: false,
        filter: "Card",
        settings: false
    },
    Clickable: {
        updater: false,
        filter: "Clickable",
        settings: false
    },
    Spinner: {
        updater: false,
        filter: "Spinner",
        settings: false
    },
    FormTitle: {
        updater: false,
        filter: "FormTitle",
        settings: false
    },
    HeaderBar: {
        updater: false,
        filter: "HeaderBar",
        settings: false
    },
    TabBar: {
        updater: false,
        filter: "TabBar",
        settings: false
    },
    Text: {
        updater: false,
        filter: "Text",
        settings: false
    },
    Flex: {
        updater: false,
        filter: "Flex",
        settings: false
    },
    Tooltip: {
        updater: false,
        filter: [
            "TooltipContainer"
        ],
        prop: "TooltipContainer",
        settings: false
    },
    AdvancedScrollerThin: {
        updater: false,
        filter: [
            "AdvancedScrollerThin"
        ],
        prop: "AdvancedScrollerThin",
        settings: false
    },
    AdvancedScrollerAuto: {
        updater: false,
        filter: [
            "AdvancedScrollerAuto"
        ],
        prop: "AdvancedScrollerAuto",
        settings: false
    },
    AdvancedScrollerNone: {
        updater: false,
        filter: [
            "AdvancedScrollerNone"
        ],
        prop: "AdvancedScrollerNone",
        settings: false
    },
    Menu: {
        updater: false,
        filter: [
            "MenuGroup"
        ],
        rename: [
            {
                from: "default",
                to: "Menu"
            }
        ],
        prop: [
            "MenuCheckboxItem",
            "MenuControlItem",
            "MenuGroup",
            "MenuItem",
            "MenuRadioItem",
            "MenuSeparator",
            "MenuStyle"
        ],
        settings: false
    }
};

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
class Components$1 {
    static byProps(...props) {
        const name = props.join(":");
        if (_classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name]) return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
        _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name] = Webpack.findModule((m)=>props.every((p)=>p in m
            ) && ("default" in m ? true : typeof m === "function")
        );
        return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
    }
    static get(name, filter = (_)=>_
    ) {
        if (_classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name]) return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
        _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name] = Webpack.findModule((m)=>m.displayName === name && filter(m)
        );
        return _classStaticPrivateFieldSpecGet(this, Components$1, __cache)[name];
    }
}
var __cache = {
    writable: true,
    value: {
    }
};

function _extends$d() {
    _extends$d = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$d.apply(this, arguments);
}
function RadioGroup({ children: title , note , required , ...props }) {
    const RadioGroup1 = Components$1.get("RadioGroup");
    return(/*#__PURE__*/ React.createElement(FormItem, {
        title: title,
        note: note,
        required: required
    }, /*#__PURE__*/ React.createElement(RadioGroup1, _extends$d({
    }, props))));
}

function _extends$c() {
    _extends$c = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$c.apply(this, arguments);
}
function SelectInput(props) {
    const { SelectInput: SelectInput1  } = DiscordModules;
    const { children: title , note , required  } = props;
    delete props.children;
    return(/*#__PURE__*/ React.createElement(FormItem, {
        title: title,
        note: note,
        required: required,
        noteHasMargin: true
    }, /*#__PURE__*/ React.createElement(SelectInput1, _extends$c({
    }, props, {
        required: required
    }))));
}

var Category = fromPromise(promise.then(()=>{
    const { Forms , Text  } = DiscordModules;
    const Caret = Components$1.get("Caret");
    return function Category({ children , opened , onChange , name , description  }) {
        return(/*#__PURE__*/ React.createElement("div", {
            className: joinClassNames("pc-category", [
                opened,
                "pc-category-opened"
            ])
        }, /*#__PURE__*/ React.createElement("div", {
            className: "pc-category-header",
            onClick: onChange
        }, /*#__PURE__*/ React.createElement("div", {
            className: "pc-category-details"
        }, /*#__PURE__*/ React.createElement(Forms.FormTitle, {
            color: Text.Colors.HEADER_PRIMARY,
            tag: Forms.FormTitle.Tags.H3,
            size: Text.Sizes.SIZE_16,
            className: "pc-category-details-title"
        }, name), /*#__PURE__*/ React.createElement(Forms.FormText, {
            color: Text.Colors.HEADER_SECONDARY,
            size: Text.Sizes.SIZE_14,
            className: "pc-category-details-description"
        }, description)), /*#__PURE__*/ React.createElement(Caret, {
            direction: opened ? Caret.Directions.DOWN : Caret.Directions.RIGHT,
            className: "pc-category-caret"
        })), /*#__PURE__*/ React.createElement("div", {
            className: `pc-category-content ${opened ? 'pc-margin-top-20' : ''}`
        }, opened && children), !opened && /*#__PURE__*/ React.createElement(Divider, null)));
    };
}));

function _extends$b() {
    _extends$b = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$b.apply(this, arguments);
}
const ColorPicker = fromPromise(Webpack.whenReady.then(()=>{
    try {
        const GuildFolderSettingsModal = Webpack.findByDisplayName("GuildFolderSettingsModal");
        if (!GuildFolderSettingsModal) throw "GuildFolderSettingsModal was not found!";
        const rendered = GuildFolderSettingsModal.prototype.render.call({
            state: {
            },
            props: {
            }
        });
        const ColorPicker1 = findInReactTree(rendered, (e)=>{
            var ref;
            return (e === null || e === void 0 ? void 0 : (ref = e.props) === null || ref === void 0 ? void 0 : ref.defaultColor) != null;
        }).type;
        if (typeof ColorPicker1 !== "function") throw "ColorPicker could not be found!";
        return (props)=>/*#__PURE__*/ React.createElement(ErrorBoundary, null, /*#__PURE__*/ React.createElement(ColorPicker1, _extends$b({
            }, props)))
        ;
    } catch (error) {
        Logger$b.error("Failed to get ColorPicker component!", error);
        return ()=>null
        ;
    }
}));
function ColorPickerInput(props) {
    const { Constants: { DEFAULT_ROLE_COLOR , ROLE_COLORS  }  } = DiscordModules;
    const { children: title , note , required , default: defaultValue , defaultColors =ROLE_COLORS , value , disabled , onChange  } = props;
    delete props.children;
    return(/*#__PURE__*/ React.createElement(FormItem, {
        title: title,
        required: required,
        note: note
    }, /*#__PURE__*/ React.createElement(ColorPicker, {
        colors: defaultColors,
        defaultColor: typeof defaultValue === "number" ? defaultValue : DEFAULT_ROLE_COLOR,
        onChange: onChange,
        disabled: disabled,
        value: value
    })));
}

function _extends$a() {
    _extends$a = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$a.apply(this, arguments);
}
const SliderInput = fromPromise(promise.then(()=>{
    const { Slider  } = DiscordModules;
    return function SliderInput(props) {
        const { children: title , note , required  } = props;
        delete props.children;
        return(/*#__PURE__*/ React.createElement(FormItem, {
            title: title,
            note: note,
            required: required
        }, /*#__PURE__*/ React.createElement(Slider, _extends$a({
        }, Object.assign({
        }, props, {
            className: [
                props.className,
                "pc-margin-top-20"
            ].filter((n)=>n
            ).join(" ")
        })))));
    };
}));

function _extends$9() {
    _extends$9 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$9.apply(this, arguments);
}
function Checkbox({ children: title , note , required , ...props }) {
    const Checkbox1 = Components$1.get("Checkbox");
    return(/*#__PURE__*/ React.createElement(FormItem, {
        title: title,
        note: note,
        required: required
    }, /*#__PURE__*/ React.createElement(Checkbox1, _extends$9({
    }, props))));
}

const Modal = {
};
Webpack.whenReady.then(()=>{
    const ModalComponents = Webpack.findByProps("ModalRoot");
    const keys = omit(Object.keys(ModalComponents), "default", "ModalRoot");
    const props1 = Object.fromEntries(keys.map((key)=>[
            key === "ModalSize" ? "Sizes" : key.slice("Modal".length),
            ModalComponents[key]
        ]
    ));
    const BindProps = (ModalComponent)=>(props)=>{
            const modalProps = React.useContext(ModalContext);
            return React.createElement(ModalComponent, Object.assign({
            }, modalProps, props));
        }
    ;
    Object.assign(Modal, props1, {
        Confirm: Object.assign(BindProps(Webpack.findByDisplayName("ConfirmModal")), {
            displayName: "PowercordModal"
        }),
        Modal: Object.assign(BindProps(ModalComponents.ModalRoot), {
            displayName: "PowercordModal"
        }, props1)
    });
});

let Components = {
    settings: {
        TextInput,
        RadioGroup,
        Category,
        ColorPickerInput,
        SliderInput,
        FormItem,
        SelectInput,
        Checkbox
    },
    Icon: Icon$1,
    AsyncComponent,
    modal: Modal,
    Icons: Icons$1,
    ColorPicker,
    Divider
};
promise.then(async ()=>{
    for(const id in components){
        const options = components[id];
        let component = (()=>{
            if (typeof options.filter === "function") {
                return Webpack.findModule(options.filter);
            }
            if (typeof options.filter === "string") {
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
        let data = {
        };
        if (Array.isArray(options.prop)) {
            Object.assign(data, Object.fromEntries(options.prop.map((prop)=>[
                    prop,
                    component[prop]
                ]
            )));
        } else if (typeof options.prop === "string") {
            data = component[options.prop];
        }
        if (Array.isArray(options.rename)) {
            for (const { from , to  } of options.rename){
                data[to] = component[from];
            }
        }
        if (!Array.isArray(options.rename) && !options.prop) {
            data = component;
        }
        const target = options.settings ? Components.settings : Components;
        Object.assign(target, {
            [id]: data
        });
    }
});

var modules = {
    messages: [
        "sendMessage",
        "editMessage",
        "deleteMessage"
    ],
    typing: [
        "startTyping"
    ],
    http: [
        "getAPIBaseURL",
        "get",
        "put",
        "post"
    ],
    constants: [
        "Endpoints",
        "AuditLogActionTypes",
        "AutoCompleteResultTypes",
        "BITRATE_DEFAULT"
    ],
    channels: [
        "getChannelId",
        "getLastSelectedChannelId",
        "getVoiceChannelId"
    ],
    spotify: [
        "play",
        "pause",
        "fetchIsSpotifyProtocolRegistered"
    ],
    spotifySocket: [
        "getActiveSocketAndDevice",
        "getPlayerState",
        "hasConnectedAccount"
    ],
    React: [
        "createRef",
        "createElement",
        "Component",
        "PureComponent"
    ],
    ReactDOM: [
        "render",
        "createPortal"
    ],
    contextMenu: [
        "openContextMenu",
        "closeContextMenu"
    ],
    modal: [
        "push",
        "update",
        "pop",
        "popWithKey"
    ],
    Flux: [
        "Store",
        "connectStores"
    ],
    FluxDispatcher: [
        "_currentDispatchActionType",
        "_processingWaitQueue"
    ],
    Router: [
        "BrowserRouter",
        "Router"
    ],
    hljs: [
        "initHighlighting",
        "highlight"
    ],
    i18n: [
        "Messages",
        "getLanguages",
        (m)=>m.Messages.CLOSE
    ]
};

function getModule(filter, retry = true, forever = false) {
    if (Array.isArray(filter)) {
        const props = filter;
        filter = (m)=>m && props.every((key)=>typeof key === "function" ? key(m) : key in m
            )
        ;
    }
    if (typeof filter !== "function") return retry ? Promise.resolve(null) : null;
    if (!retry) return Webpack.findModule(filter, {
        cache: true,
        all: false
    });
    return new Promise(async (resolve)=>{
        for(let i = 0; i < (forever ? 666 : 21); i++){
            const found = Webpack.findModule(filter, {
                cache: true,
                all: false
            });
            if (found) {
                return resolve(found);
            }
            await sleep$1(100);
        }
    });
}
function getModuleByDisplayName(displayName, retry, forever) {
    return getModule((m)=>{
        var ref;
        return ((ref = m.displayName) === null || ref === void 0 ? void 0 : ref.toLowerCase()) === displayName.toLowerCase();
    }, retry, forever);
}
function getAllModules(filter) {
    if (Array.isArray(filter)) {
        const props = filter;
        filter = (m)=>m && props.every((key)=>key in m
            )
        ;
    }
    return Webpack.findModules(filter);
}
async function init() {
    for (const [moduleId, props] of Object.entries(modules)){
        webpack[moduleId] = await getModule(props);
    }
    Object.freeze(webpack);
}
const webpack = {
    getModule,
    getAllModules,
    getModuleByDisplayName
};

function inject(id, module, functionName, callback, pre = false) {
    if (!module) throw new Error(`Failed to patch ${id}; module is invalid.`);
    if (pre) {
        Patcher.before(id, module, functionName, (_this, args)=>{
            return Reflect.apply(callback, _this, [
                args
            ]);
        });
    } else {
        Patcher.after(id, module, functionName, (_this, args, ret)=>{
            return Reflect.apply(callback, _this, [
                args,
                ret
            ]);
        });
    }
}
function uninject(id) {
    return Patcher.unpatchAll(id);
}
function isInjected(id) {
    return Patcher.getPatchesByCaller(id).length > 0;
}
const injector = {
    inject,
    uninject,
    isInjected
};

const Logger$4 = Logger$b.create("StyleManager");
class StyleManager extends Emitter {
    static get folder() {
        return path.resolve(DataStore$1.baseDir, "themes");
    }
    static get addons() {
        return Array.from(this.themes, (e)=>e[1]
        );
    }
    static initialize() {
        SettingsRenderer.registerPanel("themes", {
            label: "Themes",
            order: 2,
            render: ()=>DiscordModules.React.createElement(AddonPanel, {
                    type: "theme",
                    manager: this
                })
        });
        this.states = DataStore$1.tryLoadData("themes");
        this.loadAllThemes();
    }
    static loadAllThemes() {
        if (!fs.existsSync(this.folder)) {
            try {
                fs.mkdirSync(this.folder);
            } catch (error) {
                return void Logger$4.error("StyleManager", `Failed to create themes folder:`, error);
            }
        }
        if (!fs.statSync(this.folder).isDirectory()) return void Logger$4.error("StyleManager", `Plugins dir isn't a folder.`);
        Logger$4.log("StyleManager", "Loading themes...");
        for (const file of fs.readdirSync(this.folder, "utf8")){
            const location = path.resolve(this.folder, file);
            if (!fs.statSync(location).isDirectory()) continue;
            if (!this.mainFiles.some((f)=>fs.existsSync(path.join(location, f))
            )) continue;
            try {
                this.loadTheme(location);
            } catch (error) {
                Logger$4.error(`Failed to load theme ${file}:`, error);
            }
        }
    }
    static clearCache(theme) {
        if (!path.isAbsolute(theme)) theme = path.resolve(this.folder, theme);
        let current;
        while(current = Require.resolve(theme)){
            delete NodeModule.cache[current];
        }
    }
    static resolve(themeOrName) {
        if (typeof themeOrName === "string") return this.themes.get(themeOrName);
        return themeOrName;
    }
    static saveData() {
        DataStore$1.trySaveData("themes", this.states);
    }
    static isEnabled(addon) {
        const theme = this.resolve(addon);
        if (!theme) return;
        return Boolean(this.states[theme.entityID]);
    }
    static loadTheme(location, log = true) {
        const _path = path.resolve(location, this.mainFiles.find((f)=>fs.existsSync(path.resolve(location, f))
        ));
        const manifest = Object.freeze(Require(_path));
        const entityID = path.basename(location);
        if (this.themes.get(entityID)) throw new Error(`Theme with ID ${entityID} already exists!`);
        let data = new Theme$1();
        try {
            this.clearCache(location);
            Object.defineProperties(data, {
                entityID: {
                    value: entityID,
                    configurable: false,
                    writable: false
                },
                manifest: {
                    value: manifest,
                    configurable: false,
                    writable: false
                },
                settings: {
                    value: null,
                    configurable: false,
                    writable: false
                },
                path: {
                    value: location,
                    configurable: false,
                    writable: false
                }
            });
        } catch (error) {
            return void Logger$4.error(`Failed to compile ${manifest.name || path.basename(location)}:`, error);
        }
        if (log) {
            Logger$4.log(`${manifest.name} was loaded!`);
        }
        this.themes.set(path.basename(location), data);
        if (this.isEnabled(path.basename(location))) {
            this.startTheme(data);
        }
    }
    static unloadAddon(addon, log = true) {
        const theme = this.resolve(addon);
        if (!addon) return;
        const success = this.stopTheme(theme);
        this.clearCache(theme.path);
        if (log) {
            Logger$4.log(`${theme.displayName} was unloaded!`);
        }
        return success;
    }
    static reloadTheme(addon) {
        const theme = this.resolve(addon);
        if (!addon) return;
        const success = this.unloadAddon(theme, false);
        if (!success) {
            return Logger$4.error(`Something went wrong while trying to unload ${theme.displayName}:`);
        }
        this.startTheme(theme, false);
        Logger$4.log(`Finished reloading ${theme.displayName}.`);
    }
    static startTheme(addon, log = true) {
        const theme = this.resolve(addon);
        if (!theme) return;
        try {
            theme._load();
            if (log) {
                Logger$4.log(`${theme.displayName} has been loaded!`);
            }
        } catch (error) {
            Logger$4.error(`Could not load ${theme.displayName}:`, error);
        }
        return true;
    }
    static stopTheme(addon, log = true) {
        const theme = this.resolve(addon);
        if (!theme) return;
        try {
            theme._unload();
            if (log) {
                Logger$4.log(`${theme.displayName} has been stopped!`);
            }
        } catch (error) {
            Logger$4.error(`Could not stop ${theme.displayName}:`, error);
            return false;
        }
        return true;
    }
    static enableTheme(addon, log = true) {
        const theme = this.resolve(addon);
        if (!theme) return;
        this.states[theme.entityID] = true;
        DataStore$1.trySaveData("themes", this.states);
        this.startTheme(theme, false);
        if (log) {
            Logger$4.log(`${theme.displayName} has been enabled!`);
            this.emit("toggle", theme.entityID, true);
        }
    }
    static disableTheme(addon, log = true) {
        const theme = this.resolve(addon);
        if (!theme) return;
        this.states[theme.entityID] = false;
        DataStore$1.trySaveData("themes", this.states);
        this.stopTheme(theme, false);
        if (log) {
            Logger$4.log(`${theme.displayName} has been disabled!`);
            this.emit("toggle", theme.entityID, false);
        }
    }
    static delete(addon) {
        const theme = this.resolve(addon);
        if (!theme) return;
        this.unloadAddon(theme);
        this.themes.delete(theme.entityID);
        PCCompatNative.executeJS(`require("electron").shell.trashItem(${JSON.stringify(theme.path)})`);
        this.emit("delete", theme);
    }
    static toggle(addon) {
        const theme = this.resolve(addon);
        if (!theme) return;
        if (this.isEnabled(theme.entityID)) this.disable(theme);
        else this.enable(theme);
    }
    static get(name) {
        return this.themes.get(name);
    }
    static get enable() {
        return this.enableTheme;
    }
    static get disable() {
        return this.disableTheme;
    }
    static get reload() {
        return this.reloadTheme;
    }
    static get remount() {
        return this.reloadTheme;
    }
    static get getThemes() {
        return [
            ...this.themes.keys()
        ];
    }
}
StyleManager.mainFiles = [
    "powercord_manifest.json",
    "manifest.json"
];
StyleManager.themes = new Map();

class EventEmitter {
    static get EventEmitter() {
        return EventEmitter;
    }
    static get defaultMaxListeners() {
        return 10;
    }
    setMaxListeners(count) {
        if (typeof count !== "number" || count < 0 || Number.isNaN(count)) throw new Error(`Invalid argument for "count": ${count}`);
        this.maxListeners = count;
        return this;
    }
    emit(event, ...args) {
        if (!this.events[event]) return this;
        for (const [index, listener] of this.events[event].entries()){
            try {
                listener(...args);
            } catch (error) {
                Logger$b.error("Emitter", `Cannot fire listener for event ${event} at position ${index}:`, error);
            }
        }
        return this;
    }
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event].delete(callback);
        return this;
    }
    on(event, callback) {
        if (!this.events[event]) this.events[event] = new Set();
        this.emit("newListener", event, callback);
        this.events[event].add(callback);
        return this;
    }
    once(event, callback) {
        this.on(event, callback);
        return this;
    }
    removeAllListeners(event) {
        if (this.events[event]) {
            this.events[event].clear();
        }
        return this;
    }
    listenerCount(eventName) {
        var ref;
        var ref1;
        return (ref1 = (ref = this.events[eventName]) === null || ref === void 0 ? void 0 : ref.size) !== null && ref1 !== void 0 ? ref1 : 0;
    }
    getMaxListeners() {
        return this.maxListeners;
    }
    eventNames() {
        return Reflect.ownKeys(this.events);
    }
    // Aliases
    get removeListener() {
        return this.off;
    }
    get addListener() {
        return this.on;
    }
    constructor(){
        this.maxListeners = EventEmitter.defaultMaxListeners;
        this.events = {
            newListener: new Set()
        };
    }
}

function get$1(url, options, res) {
    if (typeof options === "function") {
        res = options;
        options = void 0;
    }
    const id = "HTTPS_GET_" + Math.random().toString(36).slice(2);
    const emitter = new EventEmitter();
    PCCompatNative.IPC.on(id, (event, ...args)=>{
        if (event === "__data") {
            return Object.assign(emitter, ...args);
        }
        if (args[0] instanceof Uint8Array) {
            args[0].toString = ()=>String.fromCharCode(...args[0])
            ;
        }
        if (event === "end") {
            Object.assign(emitter, args[0]);
        }
        emitter.emit(event, ...args);
    });
    Object.assign(emitter, {
        end: ()=>void 0
    });
    const args1 = [
        url,
        options
    ].filter(Boolean).map((e)=>JSON.stringify(e)
    ).join(", ");
    PCCompatNative.executeJS(`
        require("https").get(${args1}, (res) => {
            for (const event of ["end", "data", "close"]) {
                res.on(event, (...args) => {
                    if (event === "end") {
                        args.push(Object.fromEntries(["statusCode", "statusMessage", "url", "headers", "method", "aborted", "complete", "rawHeaders", "end"].map(e => [e, res[e]])));
                    }

                    PCCompatNative.IPC.dispatch(${JSON.stringify(id)}, event, ...args);

                    if (event === "close") {
                        delete PCCompatEvents[${JSON.stringify(id)}];
                    }
                });
            }
        });
    `);
    return res(emitter), emitter;
}
function request$1(...args) {
    return Reflect.apply(get$1, this, arguments);
}
function createServer$1() {
    return DiscordNative.nativeModules.requireModule("discord_rpc").RPCWebSocket.http.createServer.apply(this, arguments);
}

var https = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get: get$1,
    request: request$1,
    createServer: createServer$1
});

function get(url, options, res) {
    if (typeof options === "function") {
        res = options;
        options = void 0;
    }
    const id = "HTTPS_GET_" + Math.random().toString(36).slice(2);
    const emitter = new EventEmitter();
    PCCompatNative.IPC.on(id, (event, ...args)=>{
        if (event === "__data") {
            return Object.assign(emitter, ...args);
        }
        if (args[0] instanceof Uint8Array) {
            args[0].toString = ()=>String.fromCharCode(...args[0])
            ;
        }
        if (event === "end") {
            Object.assign(emitter, args[0]);
        }
        emitter.emit(event, ...args);
    });
    Object.assign(emitter, {
        end: ()=>void 0
    });
    const args1 = [
        url,
        options
    ].filter(Boolean).map((e)=>JSON.stringify(e)
    ).join(", ");
    PCCompatNative.executeJS(`
        require("http").get(${args1}, (res) => {
            for (const event of ["end", "data", "close"]) {
                res.on(event, (...args) => {
                    if (event === "end") {
                        args.push(Object.fromEntries(["statusCode", "statusMessage", "url", "headers", "method", "aborted", "complete", "rawHeaders", "end"].map(e => [e, res[e]])));
                    }

                    PCCompatNative.IPC.dispatch(${JSON.stringify(id)}, event, ...args);

                    if (event === "close") {
                        delete PCCompatEvents[${JSON.stringify(id)}];
                    }
                });
            }
        });
    `);
    return res(emitter), emitter;
}
function request(...args) {
    return Reflect.apply(get, this, arguments);
}
function createServer() {
    return DiscordNative.nativeModules.requireModule("discord_rpc").RPCWebSocket.http.createServer.apply(this, arguments);
}

var http = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get: get,
    request: request,
    createServer: createServer
});

const querystring = PCCompatNative.executeJS(`require("querystring")`);

var url = {
    parse: (...args)=>PCCompatNative.executeJS(`
        PCCompatNative.cloneObject(require("url").parse(${args.map((e)=>JSON.stringify(e)
        ).join(", ")}));
    `)
};

const Logger$3 = Logger$b.create("HTTP");
class HTTPError extends Error {
    constructor(message, res){
        super(message);
        Object.assign(this, res);
        this.name = this.constructor.name;
    }
}
class GenericRequest {
    _objectify(key, value) {
        return key instanceof Object ? key : {
            [key]: value
        };
    }
    query(key, value) {
        Object.assign(this.opts.query, this._objectify(key, value));
        return this;
    }
    set(key, value) {
        Object.assign(this.opts.headers, this._objectify(key, value));
        return this;
    }
    send(data) {
        if (data instanceof Object) {
            const serialize = this.opts.headers["Content-Type"] === "application/x-www-form-urlencoded" ? querystring.encode : JSON.stringify;
            this.opts.data = serialize(data);
        } else {
            this.opts.data = data;
        }
        return this;
    }
    execute() {
        return new Promise((resolve, reject)=>{
            const opts = Object.assign({
            }, this.opts);
            Logger$3.debug("Performing request to", opts.uri);
            const { request  } = opts.uri.startsWith("https") ? https : http;
            if (Object.keys(opts.query)[0]) {
                opts.uri += `?${querystring.encode(opts.query)}`;
            }
            const options = Object.assign({
            }, opts, url.parse(opts.uri));
            const req = request(options, (res)=>{
                const data = [];
                res.on("data", (chunk)=>{
                    data.push(chunk);
                });
                res.once("error", reject);
                res.once("end", ()=>{
                    const raw = Buffer.concat(data);
                    const result = {
                        raw,
                        body: (()=>{
                            if (/application\/json/.test(res.headers["content-type"])) {
                                try {
                                    return JSON.parse(raw);
                                } catch (_) {
                                }
                            }
                            return raw;
                        })(),
                        ok: res.statusCode >= 200 && res.statusCode < 400,
                        statusCode: res.statusCode,
                        statusText: res.statusMessage,
                        headers: res.headers
                    };
                    if (result.ok) {
                        resolve(result);
                    } else {
                        reject(new HTTPError(`${res.statusCode} ${res.statusMessage}`, result));
                    }
                });
            });
            req.once("error", reject);
            if (this.opts.data) {
                req.write(this.opts.data);
            }
            req.end();
        });
    }
    then(resolver, rejector) {
        if (this._res) {
            return this._res.then(resolver, rejector);
        }
        return this._res = this.execute().then(resolver, rejector);
    }
    catch(rejector) {
        return this.then(null, rejector);
    }
    constructor(method, uri){
        this.opts = {
            method,
            uri,
            query: {
            },
            headers: {
                "User-Agent": navigator.userAgent
            }
        };
    }
}

var index$1 = {
    get (url) {
        return new GenericRequest("GET", url);
    },
    post (url) {
        return new GenericRequest("POST", url);
    },
    patch (url) {
        return new GenericRequest("PATCH", url);
    },
    put (url) {
        return new GenericRequest("PUT", url);
    },
    del (url) {
        return new GenericRequest("DELETE", url);
    },
    head (url) {
        return new GenericRequest("HEAD", url);
    }
};

const constants = {
    WEBSITE: 'https://github.com/strencher-kernel/pc-compat',
    I18N_WEBSITE: 'https://example.com',
    REPO_URL: 'strencher-kernel/pc-compat',
    SETTINGS_FOLDER: null,
    CACHE_FOLDER: null,
    LOGS_FOLDER: null,
    DISCORD_INVITE: '8mPTjTZ4SZ',
    GUILD_ID: '891039687785996328',
    SpecialChannels: {
        KNOWN_ISSUES: '891039688352219198',
        SUPPORT_INSTALLATION: '891053581136982056',
        SUPPORT_PLUGINS: '891053581136982056',
        SUPPORT_MISC: '891053581136982056',
        STORE_PLUGINS: '649571600764633088',
        STORE_THEMES: '649571547350302741',
        CSS_SNIPPETS: '755005803303403570',
        JS_SNIPPETS: '896214131525443635'
    }
};

let initialized = false;
Webpack.whenReady.then(()=>{
    initialized = true;
});
function once(event, callback) {
    switch(event){
        case "loaded":
            {
                return Webpack.whenReady.then(callback);
            }
    }
}

var powercord$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    entities: entities,
    api: index$2,
    util: util$1,
    modal: modal,
    get initialized () { return initialized; },
    once: once,
    components: Components,
    webpack: webpack,
    injector: injector,
    pluginManager: PluginManager,
    styleManager: StyleManager,
    http: index$1,
    constants: constants
});

// Main
const COMPILE_SASS = "pccompat-compile-sass";
const COMPILE_JSX = "pccompat-compile-jsx";
// Preload
const EXPOSE_PROCESS_GLOBAL = "pccompat-expose-process-global";

class SASS {
    static compile(file) {
        return electron.ipcRenderer.sendSync(COMPILE_SASS, file);
    }
}

class JSXCompiler {
    static compile(file) {
        return electron.ipcRenderer.sendSync(COMPILE_JSX, file);
    }
}

const os = PCCompatNative.executeJS(`require("os")`);

const util = PCCompatNative.executeJS(`require("util")`);

const zlib = PCCompatNative.executeJS(`require("zlib")`);

const methods$3 = PCCompatNative.executeJS(`Object.keys(require("stream"))`);
const stream = {
};
for (const key of methods$3){
    // @ts-ignore
    stream[key] = PCCompatNative.executeJS(`require("stream").${key}`);
}

const methods$2 = PCCompatNative.executeJS(`Object.keys(require("crypto"))`);
const crypto = {
};
for (const key of methods$2){
    // @ts-ignore
    crypto[key] = PCCompatNative.executeJS(`require("crypto").${key}`);
}

const methods$1 = PCCompatNative.executeJS(`Object.keys(require("net"))`);
const net = {
};
for (const key of methods$1){
    // @ts-ignore
    net[key] = PCCompatNative.executeJS(`require("net").${key}`);
}

const methods = PCCompatNative.executeJS(`Object.keys(require("tls"))`);
const tls = {
};
for (const key of methods){
    // @ts-ignore
    tls[key] = PCCompatNative.executeJS(`require("tls").${key}`);
}

const cache$2 = {
};
const globalPaths = [
    path.resolve(PCCompatNative.getBasePath(), "node_modules")
];
const extensions = {
    ".js": (module, filename)=>{
        const fileContent = fs.readFileSync(filename, "utf8");
        module.filecontent = fileContent;
        module._compile(fileContent);
        return module.exports;
    },
    ".json": (module, filename)=>{
        const filecontent = fs.readFileSync(filename, "utf8");
        module.filecontent = filecontent;
        module.exports = JSON.parse(filecontent);
        return module.exports;
    },
    ".jsx": (module, filename)=>{
        const code = JSXCompiler.compile(filename);
        module.filecontent = code;
        module._compile(code);
        return module.exports;
    },
    ".scss": (module, filename)=>{
        const content = SASS.compile(filename);
        module.filecontent = content;
        module.exports = content;
        return content;
    },
    ".css": (module, filename)=>{
        const content = fs.readFileSync(filename, "utf8");
        module.filecontent = content;
        module.exports = content;
        return module.exports;
    },
    // I haven't tested this - I assume it works.
    // TODO: Make this not shitty
    ".node": (module, filename)=>{
        const thing = PCCompatNative.executeJS(`require(${JSON.stringify(filename)})`);
        module.exports = thing;
        return thing;
    }
};
class Module {
    _compile(code) {
        const wrapped = window.eval(`((${[
            "require",
            "module",
            "exports",
            "__filename",
            "__dirname",
            "global"
        ].join(", ")}) => {
            ${code}
            //# sourceURL=${JSON.stringify(this.filename).slice(1, -1)}
        })`);
        wrapped(this.require, this, this.exports, this.filename, this.path, window);
    }
    constructor(id, parent, require){
        this.id = id;
        this.path = path.dirname(id);
        this.exports = {
        };
        this.parent = parent;
        this.filename = id;
        this.loaded = false;
        this.children = [];
        this.require = require;
        if (parent) parent.children.push(this);
    }
}
function resolve(path1) {
    for(const key in cache$2){
        if (key.startsWith(path1)) return key;
    }
}
function getExtension(mod) {
    return path.extname(mod) || Object.keys(extensions).find((ext)=>fs.existsSync(mod + ext)
    ) || "";
}
function createRequire(_path) {
    const require = (mod)=>{
        if (typeof mod !== "string") return;
        switch(mod){
            case "powercord":
                return powercord$1;
            case "path":
                return path;
            case "fs":
                return fs;
            case "module":
                return NodeModule;
            case "process":
                return window.process;
            case "electron":
                return electron;
            case "https":
            case "http":
                return http;
            case "react":
                return DiscordModules.React;
            case "react-dom":
                return DiscordModules.ReactDOM;
            case "events":
                return EventEmitter;
            case "os":
                return os;
            case "util":
                return util;
            case "zlib":
                return zlib;
            case "stream":
                return stream;
            case "querystring":
                return querystring;
            case "url":
                return url;
            case "net":
                return net;
            case "tls":
                return tls;
            case "crypto":
                return crypto;
            default:
                {
                    if (mod.startsWith("powercord/")) {
                        const value1 = mod.split("/").slice(1).reduce((value, key)=>value[key]
                        , powercord$1);
                        if (value1) return value1;
                    }
                    return load(_path, mod);
                }
        }
    };
    Object.assign(require, {
        cache: cache$2,
        resolve
    });
    // @ts-ignore
    return require;
}
function hasExtension(mod) {
    return extensions[path.extname(mod)] != null;
}
function getGlobalPath(mod) {
    return globalPaths.find((pth)=>fs.existsSync(path.join(pth, mod))
    ) || globalPaths.find((pth)=>getExtension(path.join(pth, mod))
    ) || "";
}
function getParent(_path, mod) {
    const concatPath = path.resolve(_path, mod);
    const globalPath = path.join(getGlobalPath(mod), mod);
    return fs.existsSync(concatPath) ? concatPath : fs.existsSync(globalPath) ? globalPath : "";
}
function resolveMain(_path, mod) {
    const parent = hasExtension(_path) ? path.dirname(_path) : getParent(_path, mod);
    if (!fs.existsSync(parent)) throw new Error(`Cannot find module ${mod}\ntree:\n\r-${_path}`);
    const files = fs.readdirSync(parent, "utf8");
    for (const file of files){
        const ext = path.extname(file);
        if (file === "package.json") {
            const pkg = JSON.parse(fs.readFileSync(path.resolve(parent, file), "utf8"));
            if (!Reflect.has(pkg, "main")) continue;
            return path.resolve(parent, hasExtension(pkg.main) ? pkg.main : pkg.main + getExtension(path.join(parent, pkg.main)));
        }
        if (file.slice(0, -ext.length) === "index" && extensions[ext]) return path.resolve(parent, file);
    }
    if (mod.startsWith("./")) return null;
    const globalMod = globalPaths.find((pth)=>fs.existsSync(path.join(pth, mod))
    );
    if (globalMod) return resolveMain(globalMod, mod);
    return globalPaths.find((pth)=>getExtension(path.join(pth, mod))
    );
}
function getFilePath(_path, mod) {
    const combined = path.resolve(_path, mod);
    const pth = hasExtension(combined) ? combined : combined + getExtension(combined);
    if (fs.existsSync(pth) && fs.statSync(pth).isFile()) return pth;
    if (!hasExtension(mod)) return resolveMain(_path, mod);
    return mod;
}
function load(_path, mod, req = null) {
    if (mod.includes("pc-settings/components/ErrorBoundary")) return ErrorBoundary;
    const file = getFilePath(_path, mod);
    if (!fs.existsSync(file)) throw new Error(`Cannot find module ${mod}\ntree:\n\r-${_path}`);
    if (cache$2[file]) return cache$2[file].exports;
    const stats = fs.statSync(file, "utf8");
    if (stats.isDirectory()) mod = resolveMain(_path, mod);
    const ext = getExtension(file);
    const loader = extensions[ext];
    if (!loader) throw new Error(`Cannot find module ${file}`);
    const module = cache$2[file] = new Module(file, req, createRequire(path.dirname(file)));
    loader(module, file);
    return module.exports;
}
// TODO: Add globalPaths support
const NodeModule = {
    _extensions: extensions,
    cache: cache$2,
    _load: load,
    globalPaths: globalPaths
};

var Require = createRequire(path.resolve(PCCompatNative.getBasePath(), "plugins"));

const Logger$2 = Logger$b.create("DataStore");
const DataStore = new class DataStore extends Store {
    tryLoadData(name, def = {
    }) {
        if (this.cache.has(name)) return this.cache.get(name);
        try {
            const location = path.resolve(this.configFolder, `${name}.json`);
            if (!fs.existsSync(location)) return def;
            const data = Require(location);
            if (Object.keys(data).length === 0) return def;
            this.cache.set(name, data);
            return data;
        } catch (error) {
            Logger$2.error(`Data of ${name} corrupt:`, error);
            return def;
        }
    }
    trySaveData(name, data, emit, event = "data-update") {
        this.cache.set(name, data);
        try {
            fs.writeFileSync(path.resolve(this.configFolder, `${name}.json`), JSON.stringify(data, null, "\t"), "utf8");
        } catch (error) {
            Logger$2.error(`Failed to save data of ${name}:`, error);
        }
        if (emit) this.emit(event, name, data);
    }
    getMisc(misc = "", def) {
        var ref;
        return (ref = getProps(this.tryLoadData("misc"), misc)) !== null && ref !== void 0 ? ref : def;
    }
    setMisc(misc = this.getMisc("", {
    }), prop, value) {
        this.trySaveData("misc", _.set(misc, prop.split("."), value));
        this.emit("misc");
    }
    constructor(){
        super();
        this.baseDir = path.resolve(PCCompatNative.getBasePath());
        this.configFolder = path.resolve(this.baseDir, "config");
        this.cache = new Map();
        if (!fs.existsSync(this.configFolder)) {
            try {
                fs.mkdirSync(this.configFolder);
            } catch (error) {
                Logger$2.error("Failed to create config folder:", error);
            }
        }
    }
};
var DataStore$1 = DataStore;

var Internals = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Utilities: utilities,
    Webpack: Webpack,
    ComponentPatcher: componentpatcher,
    DiscordModules: DiscordModules,
    DataStore: DataStore$1,
    Patcher: Patcher,
    memoize: memoize,
    Logger: Logger$b,
    DOM: DOM
});

function getLanguage(filename) {
    if (!filename) return "";
    switch(path.extname(filename)){
        case ".js":
            return "javascript";
        case ".scss":
        case ".sass":
            return "scss";
        case ".css":
            return "css";
        default:
            return filename.slice(1);
    }
}
const cache$1 = new Map();
function Editor1({ filename , onChange  }) {
    const editorRef = DiscordModules.React.useRef();
    const containerRef = DiscordModules.React.useRef();
    const bindings = DiscordModules.React.useRef([]);
    DiscordModules.React.useEffect(()=>{
        if (!containerRef.current) return;
        const value1 = fs.existsSync(filename) ? cache$1.has(filename) ? cache$1.get(filename) : (cache$1.set(filename, fs.readFileSync(filename, "utf8")), cache$1.get(filename)) : "";
        const Editor = editorRef.current = window.monaco.editor.create(containerRef.current, {
            value: value1,
            language: getLanguage(filename),
            theme: "vs-dark"
        });
        bindings.current.push(Editor.onDidChangeModelContent(()=>{
            const value = Editor.getValue();
            cache$1.set(filename, value);
            onChange(value);
        }));
        return ()=>{
            for (const binding of bindings.current)binding.dispose();
            Editor.dispose();
        };
    }, [
        containerRef,
        editorRef,
        filename
    ]);
    DiscordModules.React.useEffect(()=>{
        const listener = ()=>{
            if (!editorRef.current) return;
            editorRef.current.layout();
        };
        DiscordModules.Dispatcher.subscribe("PCCOMPAT_UPDATE_POSITION", listener);
        return ()=>{
            DiscordModules.Dispatcher.unsubscribe("PCCOMPAT_UPDATE_POSITION", listener);
        };
    });
    return(/*#__PURE__*/ React.createElement("div", {
        className: "pc-editor",
        ref: containerRef
    }));
}

const [usePanelStore, PanelAPI] = createStore({
    sidebarVisible: true,
    panel: "",
    selectedFile: null
});

const Logger$1 = Logger$b.create("QuickCSS:util");
const filesPath = path.resolve(PCCompatNative.getBasePath(), "config", "quickcss");
const createStorage = function() {
    try {
        fs.mkdirSync(filesPath);
    } catch (error) {
        Logger$1.error("Failed to create QuickCSS folder:", error);
    }
    return [];
};
const getConfig = function() {
    return DataStore$1.tryLoadData("quickcss", {
        files: [],
        states: {
        }
    });
};
const setConfig = function(items) {
    const { Lodash  } = DiscordModules;
    return DataStore$1.trySaveData("quickcss", Lodash.merge({
    }, getConfig(), items), true, "QUICK_CSS_UPDATE");
};
const getFiles = function() {
    return getConfig().files.filter((file)=>fs.existsSync(file)
    );
};
const closeFile = function(filepath) {
    const config = getConfig();
    const index = config.files.indexOf(filepath);
    if (index < 0) return;
    config.files.splice(index, 1);
    DataStore$1.trySaveData("quickcss", {
        ...config
    });
};
const openFile = function(filepath) {
    const config = getConfig();
    const index = config.files.indexOf(filepath);
    if (index > -1) return;
    config.files.push(filepath);
    DataStore$1.trySaveData("quickcss", {
        ...config
    });
};

function _extends$8() {
    _extends$8 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$8.apply(this, arguments);
}
function FolderOpened(props) {
    return(/*#__PURE__*/ React.createElement("svg", _extends$8({
        width: "24",
        height: "24",
        viewBox: "0 0 576 512"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"
    })));
}

function _extends$7() {
    _extends$7 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$7.apply(this, arguments);
}
function Folder(props) {
    return(/*#__PURE__*/ React.createElement("svg", _extends$7({
        width: "24",
        height: "24",
        viewBox: "0 0 512 512"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"
    })));
}

function _extends$6() {
    _extends$6 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$6.apply(this, arguments);
}
function PaintBrush(props) {
    return(/*#__PURE__*/ React.createElement("svg", _extends$6({
        width: "24",
        height: "24",
        viewBox: "0 0 512 512"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M167.02 309.34c-40.12 2.58-76.53 17.86-97.19 72.3-2.35 6.21-8 9.98-14.59 9.98-11.11 0-45.46-27.67-55.25-34.35C0 439.62 37.93 512 128 512c75.86 0 128-43.77 128-120.19 0-3.11-.65-6.08-.97-9.13l-88.01-73.34zM457.89 0c-15.16 0-29.37 6.71-40.21 16.45C213.27 199.05 192 203.34 192 257.09c0 13.7 3.25 26.76 8.73 38.7l63.82 53.18c7.21 1.8 14.64 3.03 22.39 3.03 62.11 0 98.11-45.47 211.16-256.46 7.38-14.35 13.9-29.85 13.9-45.99C512 20.64 486 0 457.89 0z"
    })));
}

function _extends$5() {
    _extends$5 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$5.apply(this, arguments);
}
function Save(props) {
    return(/*#__PURE__*/ React.createElement("svg", _extends$5({
        width: "24",
        height: "24",
        viewBox: "0 0 448 512"
    }, props), /*#__PURE__*/ React.createElement("path", {
        fill: "currentColor",
        d: "M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
    })));
}

function _extends$4() {
    _extends$4 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$4.apply(this, arguments);
}
const Icons = {
    FolderOpened,
    Folder,
    PaintBrush,
    Save
};
function Icon({ name , ...props }) {
    const IconComponent = Icons[name];
    let extraProps = {
    };
    if (!IconComponent) return null;
    if (props.size) {
        extraProps.width = extraProps.height = props.size;
    }
    return(/*#__PURE__*/ React.createElement(IconComponent, _extends$4({
    }, props, extraProps)));
}

function _extends$3() {
    _extends$3 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$3.apply(this, arguments);
}
function Css(props) {
    return(/*#__PURE__*/ React.createElement("svg", _extends$3({
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        xmlns: "http://www.w3.org/2000/svg"
    }, props), /*#__PURE__*/ React.createElement("path", {
        d: "m5 3-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4 7.85 3 9.05-3 1.2-6.03.24-1.21L21.94 3H5z",
        fill: "#42a5f5"
    })));
}

function _extends$2() {
    _extends$2 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$2.apply(this, arguments);
}
function Sass(props) {
    return(/*#__PURE__*/ React.createElement("svg", _extends$2({
        width: "24",
        height: "24",
        viewBox: "0 0 500 500",
        xmlSpace: "preserve",
        xmlns: "http://www.w3.org/2000/svg"
    }, props), /*#__PURE__*/ React.createElement("path", {
        d: "M419.047 96.227C406.855 48.39 327.54 32.67 252.472 59.336c-44.68 15.876-93.029 40.785-127.81 73.31-41.349 38.675-47.943 72.329-45.216 86.396 9.583 49.621 77.585 82.068 105.535 106.125v.144c-8.246 4.051-68.565 34.585-82.684 65.8-14.893 32.932 2.372 56.556 13.804 59.742 35.424 9.858 71.765-7.866 91.312-37.01 18.852-28.12 17.279-64.422 9.085-82.488 11.3-2.976 24.476-4.313 41.218-2.36 47.248 5.52 56.517 35.017 54.747 47.367s-11.681 19.14-14.998 21.185-4.326 2.767-4.05 4.287c.406 2.216 1.94 2.137 4.758 1.652 3.894-.655 24.804-10.042 25.709-32.827 1.14-28.934-26.587-61.302-75.684-60.45-20.216.354-32.933 2.268-42.123 5.69-.681-.774-1.363-1.548-2.084-2.308-30.35-32.382-86.46-55.285-84.088-98.823.866-15.824 6.372-57.5 107.817-108.053 83.104-41.414 149.638-30.009 161.135-4.759 16.427 36.079-35.554 103.137-121.857 112.812-32.88 3.684-50.199-9.06-54.499-13.805-4.536-4.995-5.204-5.218-6.909-4.287-2.753 1.534-1.01 5.939 0 8.574 2.583 6.712 13.15 18.603 31.176 24.516 15.863 5.204 54.459 8.062 101.157-9.99 52.282-20.255 93.12-76.523 81.124-123.549zM196.584 339.995c3.92 14.5 3.487 28.016-.564 40.247a65.289 65.289 0 0 1-3.225 7.97c-3.12 6.477-7.315 12.534-12.441 18.132-15.654 17.07-37.508 23.533-46.882 18.092-10.12-5.873-5.047-29.943 13.084-49.11 19.52-20.635 47.602-33.902 47.602-33.902l-.039-.08 2.465-1.35z",
        fill: "#ec407a",
        stroke: "#ec407a",
        "stroke-width": "16.286552999999998"
    })));
}

function _extends$1() {
    _extends$1 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$1.apply(this, arguments);
}
function FileIcon({ ext , ...props }) {
    switch(ext){
        case ".scss":
        case ".sass":
            return(/*#__PURE__*/ React.createElement(Sass, _extends$1({
            }, props)));
        case ".css":
            return(/*#__PURE__*/ React.createElement(Css, _extends$1({
            }, props)));
        default:
            return null;
    }
}

function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function SideBarButton({ label , icon , selected , onClick , className =""  }) {
    const { Tooltips  } = DiscordModules;
    return(/*#__PURE__*/ React.createElement("div", {
        className: joinClassNames("pc-quickcss-sidebar-icon", [
            selected,
            "pc-quickcss-selected"
        ], className),
        onClick: onClick,
        key: label
    }, /*#__PURE__*/ React.createElement(Tooltips.Tooltip, {
        text: label,
        position: "right"
    }, (props)=>typeof icon === "string" ? /*#__PURE__*/ React.createElement(Icon, _extends({
            name: icon
        }, props)) : React.createElement(icon, props)
    )));
}
function SideBarFile({ filepath , selected  }) {
    return(/*#__PURE__*/ React.createElement("div", {
        className: joinClassNames("pc-quickcss-sidebar-files-file", [
            selected,
            "pc-quickcss-selected"
        ]),
        onClick: ()=>{
            if (selected) return;
            openFile(filepath);
            PanelAPI.setState({
                selectedFile: filepath
            });
        },
        key: filepath
    }, /*#__PURE__*/ React.createElement(FileIcon, {
        ext: path.extname(filepath),
        width: "16",
        height: "16"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-filename"
    }, path.basename(filepath))));
}
function ControlButton({ label , action , children: icon  }) {
    const { Tooltips , Button  } = DiscordModules;
    return(/*#__PURE__*/ React.createElement(Tooltips.Tooltip, {
        text: label
    }, (props)=>/*#__PURE__*/ React.createElement(Button, _extends({
        }, props, {
            className: "pc-quickcss-controlbutton",
            onClick: action,
            look: Button.Looks.BLANK,
            size: Button.Sizes.NONE
        }), icon)
    ));
}
function SideBar() {
    const state = usePanelStore();
    const files = (fs.existsSync(filesPath) ? fs.readdirSync(filesPath, "utf8") : createStorage()).map((file)=>path.resolve(filesPath, file)
    );
    const handleSaveFile = function() {
        if (!cache$1.has(state.selectedFile)) return;
        fs.writeFileSync(state.selectedFile, cache$1.get(state.selectedFile), "utf8");
    };
    const handleCreateFile = function() {
        Modals.prompt("Create File", "Filename of the file you want to create", {
            onInput: (value)=>{
                try {
                    const location = path.resolve(filesPath, value);
                    fs.writeFileSync(location, "", "utf8");
                    PanelAPI.setState({
                        selectedFile: location
                    });
                } catch (error) {
                    Logger$b.error("QuickCSS", "Failed to create file " + value, error);
                }
            }
        });
    };
    return(/*#__PURE__*/ React.createElement("div", {
        className: joinClassNames("pc-quickcss-sidebar", [
            state.sidebarVisible,
            "pc-visible"
        ])
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-sidebar-iconsrow"
    }, /*#__PURE__*/ React.createElement(SideBarButton, {
        label: "Files",
        key: "FILES",
        selected: state.panel === "files",
        icon: state.panel === "files" && state.sidebarVisible ? "FolderOpened" : "Folder",
        onClick: ()=>{
            if (state.panel === "files") {
                PanelAPI.setState({
                    sidebarVisible: !state.sidebarVisible
                });
                setImmediate(()=>{
                    DiscordModules.Dispatcher.dirtyDispatch({
                        type: "PCCOMPAT_UPDATE_POSITION"
                    });
                });
            } else {
                PanelAPI.setState({
                    panel: "files"
                });
            }
        }
    }), /*#__PURE__*/ React.createElement(SideBarButton, {
        label: "Snippets",
        key: "SNIPPETS",
        selected: state.panel === "snippets",
        icon: "PaintBrush",
        onClick: ()=>{
            PanelAPI.setState({
                panel: "snippets"
            });
        }
    }), /*#__PURE__*/ React.createElement(SideBarButton, {
        label: "Settings",
        key: "SETTINGS",
        icon: (props)=>/*#__PURE__*/ React.createElement(DiscordIcon, _extends({
                name: "Gear"
            }, props))
        ,
        selected: state.panel === "settings",
        className: "pc-align-bottom",
        onClick: ()=>{
            PanelAPI.setState({
                panel: "settings"
            });
        }
    })), state.panel === "files" && /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-sidebar-content"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-controls"
    }, /*#__PURE__*/ React.createElement(ControlButton, {
        label: "Save",
        action: handleSaveFile
    }, /*#__PURE__*/ React.createElement(Icon, {
        name: "Save"
    })), /*#__PURE__*/ React.createElement(ControlButton, {
        label: "Create File",
        action: handleCreateFile
    }, /*#__PURE__*/ React.createElement(DiscordIcon, {
        name: "Plus"
    }))), files.map((file)=>/*#__PURE__*/ React.createElement(SideBarFile, {
            key: file,
            filepath: file,
            selected: state.selectedFile === file
        })
    ))));
}

function Snippet({ filepath  }) {
    const { Switch  } = DiscordModules;
    const isEnabled = DataStore$1.useEvent("QUICK_CSS_UPDATE", ()=>{
        const config = getConfig();
        var _filepath;
        return (_filepath = config.states[filepath]) !== null && _filepath !== void 0 ? _filepath : false;
    });
    return(/*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-snippet"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-snippet-header"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "pc-file-icon"
    }, /*#__PURE__*/ React.createElement(FileIcon, {
        ext: path.extname(filepath)
    })), /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-snippet-name"
    }, path.basename(filepath)), /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-snippet-controls"
    }, /*#__PURE__*/ React.createElement(Switch, {
        checked: isEnabled,
        onChange: ()=>{
            setConfig({
                states: {
                    [filepath]: !isEnabled
                }
            });
        }
    })))));
}
function Snippets() {
    return(/*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-panel pc-quickcss-snippets"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "pc-settings-title"
    }, "Snippets"), getFiles().map((file)=>/*#__PURE__*/ React.createElement(Snippet, {
            filepath: file,
            key: file
        })
    )));
}

const Settings = [
    {
        type: "switch",
        name: "Example Setting",
        note: "Example.",
        value: true,
        id: "example"
    },
    {
        type: "switch",
        name: "Example Setting2",
        note: "Example 2.",
        value: false,
        id: "example2"
    }
];
function SettingsPanel() {
    const { SwitchItem  } = DiscordModules;
    return(/*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-panel pc-quickcss-settings"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "pc-settings-title"
    }, "Settings"), Settings.map((setting)=>{
        switch(setting.type){
            case "switch":
                return(/*#__PURE__*/ React.createElement(SwitchItem, {
                    key: setting.id,
                    note: setting.note,
                    value: setting.value,
                    onChange: ()=>{
                    }
                }, setting.name));
            default:
                return null;
        }
    })));
}
function renderTopbarFile(filepath, selected) {
    const { Button  } = DiscordModules;
    const handleClick = function() {
        PanelAPI.setState({
            selectedFile: filepath
        });
    };
    // TODO: Render file icons with material file icon list
    return(/*#__PURE__*/ React.createElement("div", {
        className: joinClassNames("pc-quickcss-topbar-file", [
            selected,
            "pc-quickcss-selected"
        ]),
        key: filepath,
        onClick: handleClick
    }, /*#__PURE__*/ React.createElement(Button, {
        size: Button.Sizes.NONE,
        look: Button.Looks.BLANK,
        className: "pc-quickcss-close",
        onClick: ()=>{
            closeFile(filepath);
        }
    }, /*#__PURE__*/ React.createElement(DiscordIcon, {
        name: "Close"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-filename"
    }, path.basename(filepath))));
}
function QuickCSSPanel() {
    const tabs = DataStore$1.useEvent("data-update", ()=>getFiles()
    );
    const state = usePanelStore();
    return(/*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss"
    }, /*#__PURE__*/ React.createElement(SideBar, null), /*#__PURE__*/ React.createElement("div", {
        className: "pc-quickcss-content"
    }, (()=>{
        switch(state.panel){
            case "files":
                return [
                    /*#__PURE__*/ React.createElement("div", {
                        className: "pc-quickcss-topbar"
                    }, tabs.map((tab)=>renderTopbarFile(tab, state.selectedFile === tab)
                    )),
                    state.selectedFile ? /*#__PURE__*/ React.createElement(Editor1, {
                        filename: state.selectedFile,
                        onChange: (value)=>{
                        // console.log("Change:", value);
                        }
                    }) : /*#__PURE__*/ React.createElement("p", {
                        className: "pc-quickcss-notice"
                    }, "Open a File and start editing.")
                ];
            case "snippets":
                return(/*#__PURE__*/ React.createElement(Snippets, null));
            case "settings":
                return(/*#__PURE__*/ React.createElement(SettingsPanel, null));
            default:
                return(/*#__PURE__*/ React.createElement("p", {
                    className: "pc-quickcss-notice"
                }, "Welcome to PCCompat's QuickCSS editor."));
        }
    })())));
}

const Logger = Logger$b.create("QuickCSS");
class QuickCSS {
    static async initialize() {
        const { Lodash  } = DiscordModules;
        Lodash.bindAll(this, [
            "onDataUpdate"
        ]);
        SettingsRenderer.registerPanel(QuickCSS.name, {
            label: "QuickCSS",
            render: ()=>DiscordModules.React.createElement(QuickCSSPanel, {
                })
            ,
            order: 3
        });
        this.loadMonaco();
        DataStore$1.on("QUICK_CSS_UPDATE", this.onDataUpdate);
        this.onDataUpdate();
    }
    static shouldCompile(file) {
        return path.extname(file) !== ".css";
    }
    static onDataUpdate() {
        const files = getConfig().states;
        for(const file in files){
            if (this.injectedFiles[file] && !files[file]) this.injectedFiles[file].destroy();
            if (!files[file]) continue;
            if (!fs.existsSync(file)) {
                closeFile(file);
                continue;
            }
            const code = this.shouldCompile(file) ? SASS.compile(file) : fs.readFileSync(file, "utf8");
            const id = path.basename(file).split(".").join("-");
            DOM.injectCSS(id, code);
            this.injectedFiles[file] = {
                destroy () {
                    DOM.clearCSS(id);
                }
            };
        }
    }
    static async loadMonaco() {
        // Based off https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/editor.js
        Object.defineProperty(window, "MonacoEnvironment", {
            value: {
                getWorkerUrl () {
                    const monacoLoader = `
                        self.MonacoEnvironment = {baseUrl: ${JSON.stringify(MONACO_BASEURL)}};
                    `;
                    return `data:text/javascript;charset=utf-8,${encodeURIComponent(monacoLoader)}`;
                }
            }
        });
        DOM.injectCSS(QuickCSS.name, `${MONACO_BASEURL}/vs/editor/editor.main.min.css`, {
            type: "URL",
            documentHead: true
        });
        const originalRequire = window.require;
        await DOM.injectJS("monaco-script", `${MONACO_BASEURL}/vs/loader.min.js`, {
            documentHead: true
        });
        const amdLoader = window.require;
        window.require = originalRequire;
        amdLoader.config({
            paths: {
                vs: `${MONACO_BASEURL}/vs`
            }
        });
        amdLoader([
            "vs/editor/editor.main"
        ], ()=>{
        });
        Logger.log("Module loaded!");
    }
    static dispose() {
        DataStore$1.off("data-update", this.onDataUpdate);
    }
}
QuickCSS.injectedFiles = {
};

/// <reference path="../../types.d.ts" />
if (!("process" in window)) {
    PCCompatNative.IPC.dispatch(EXPOSE_PROCESS_GLOBAL);
}
var index = new class PCCompat {
    start() {
        promise.then(this.onStart.bind(this));
    }
    async onStart() {
        this.expose("React", DiscordModules.React);
        this.expose("powercord", Require("powercord"));
        this.expose("PCInternals", Internals);
        await init();
        powercord.api.commands.initialize();
        Object.defineProperty(window, "powercord_require", {
            value: Require,
            configurable: false,
            writable: false
        });
        DOM.injectCSS("core", Require(path.resolve(PCCompatNative.getBasePath(), "src/renderer/styles", "index.scss")));
        DOM.injectCSS("font-awesome", FONTAWESOME_BASEURL, {
            type: "URL",
            documentHead: true
        });
        SettingsRenderer.patchSettingsView();
        QuickCSS.initialize();
        PluginManager.initialize();
        StyleManager.initialize();
    }
    expose(name, namespace) {
        Object.defineProperty(window, name, {
            value: namespace,
            configurable: true,
            writable: true
        });
    }
    stop() {
    }
};

export { index as default };
//# sourceMappingURL=renderer.js.map
