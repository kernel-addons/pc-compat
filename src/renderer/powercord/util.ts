import {DiscordModules, Webpack, Patcher} from "@modules";
import {promise} from "@modules/discord";
import Events from "@modules/events";
import LoggerModule from "@modules/logger";

const Logger = LoggerModule.create("Utilities");

export const sleep = (time) => new Promise(f => setTimeout(f, time));

/**
*   Taken from StackOverflow
*   @url https://stackoverflow.com/a/34841026
*/

export function formatTime(time) {
    time = Math.floor(time / 1000);

    const hours = Math.floor(time / 3600) % 24;
    const minutes = Math.floor(time / 60) % 60;
    const seconds = time % 60;

    return [ hours, minutes, seconds ]
      .map(v => v < 10 ? `0${v}` : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
};

export function findInTree(tree = {}, filter = _ => _, {ignore = [], walkable = [], maxProperties = 100} = {}): any {
    let stack = [tree];
    const wrapFilter = function (...args) {
        try { return Reflect.apply(filter, this, args); }
        catch { return false; }
    };

    while (stack.length && maxProperties) {
        const node = stack.shift();
        if (wrapFilter(node)) return node;
        if (Array.isArray(node)) stack.push(...node);
        else if (typeof node === "object" && node !== null) {
            if (walkable.length) {
                for (const key in node) {
                    const value = node[key];
                    if (~walkable.indexOf(key) && !~ignore.indexOf(key)) {
                        stack.push(value);
                    }
                }
            } else {
                for (const key in node) {
                    const value = node[key];
                    if (node && ~ignore.indexOf(key)) continue;

                    stack.push(value);
                }
            }
        }
        maxProperties--;
    }
};

export function findInReactTree(tree, filter, options = {}) {
    return findInTree(tree, filter, {...options, walkable: ["props", "children"]});
};

export function getReactInstance(node: any) {
    return node["__reactFiber$"];
};

export function getOwnerInstance(node, filter = _ => true) {
    if (!node) return null;
    const fiber = getReactInstance(node);
    let current = fiber;

    const matches = function () {
        const isInstanceOf = current?.stateNode instanceof DiscordModules.React.Component;
        return isInstanceOf && filter(current?.stateNode);
    }

    while (!matches()) {
        current = current?.return;
    }

    return current?.stateNode ?? null;
};

export function forceUpdateElement(selector: string) {
    getOwnerInstance(document.querySelector(selector))?.forceUpdate();
};

export async function waitFor(selector: string) {
    let element = document.querySelector(selector);

    do {
        await sleep(1);
    } while(!(element = document.querySelector(selector)));

    return element;
}

const defaultOverrides = {
    useMemo: factory => factory(),
    useState: initialState => [initialState, () => void 0],
    useReducer: initialValue => [initialValue, () => void 0],
    useEffect: () => {},
    useLayoutEffect: () => {},
    useRef: () => ({current: null}),
    useCallback: callback => callback,
    useContext: ctx => ctx._currentValue
};
export function wrapInHooks(functionalComponent: Function, options?: {[key in keyof typeof defaultOverrides]?: (...args: any[]) => any}) {
    const overrides = Object.assign({}, options, defaultOverrides);
    const keys = Object.keys(overrides);

    return (...args: any) => {
        const ReactDispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
        const originals = keys.map(e => [e, ReactDispatcher[e]]);

        Object.assign(ReactDispatcher, overrides);

        let returnValue = null, error = null;
        try {
            returnValue = functionalComponent(...args);
        } catch (err) {
            error = err;
        }

        Object.assign(ReactDispatcher, Object.fromEntries(originals));

        // Throw it after react we re-assigned react's dispatcher stuff so it won't break discord entirely.
        if (error) throw error;

        return returnValue;
    };
};

const menuPatches = {};
promise.then(() => {
    const ContextMenu = Webpack.findByProps("openContextMenuLazy");
    Patcher.before("pc-context-menu-opener", ContextMenu, "openContextMenuLazy", (_, args, res) => {
        const old = args[1];

        args[1] = async () => {
            const render = await old(args[0]);
            return (props: any) => {
                const res = render(props);
                const wrapped = typeof res.type === "object" ? res.props.children : res;

                const displayName = wrapped?.type?.displayName;
                const collection = menuPatches[displayName];
                const patches = collection?.filter(p => !p.applied);

                if (displayName && patches?.length) {
                    const Menu = Webpack.findModule(m => m.default?.displayName === displayName);

                    for (const patch of patches) {
                        const Patch = Patcher[patch.before ? "before" : "after"].bind(Patcher);
                        Patch(patch.id, Menu, "default", (_, ...args) => {
                            return patch.func.apply(_, args);
                        });

                        patch.applied = true;
                    }

                    delete menuPatches[displayName];
                } else if (!displayName) {
                    const rendered = wrapInHooks(wrapped.type)(wrapped.props);
                    const displayName = rendered?.props?.children?.type?.displayName;
                    const collection = menuPatches[displayName];
                    const patches = collection?.filter(p => !p.applied);

                    const AnalyticsContext = Webpack.findModule(m => [m.default, m.__powercordOriginal_default].includes(wrapped.type));
                    if (!AnalyticsContext) return res;
                    
                    for (const patch of patches ?? []) {
                        Patcher.after(patch.id, AnalyticsContext, "default", (_, args, res) => {
                            const menu = res.props.children.type;

                            patch.memo ??= function (...args) {
                                if (patch.before) {
                                    return menu.apply(this, [patch.func.apply(this, [args])]);
                                }

                                const res = menu.apply(this, args);
                                try {
                                    return patch.func.apply(this, [args, res]);
                                } catch (e) {
                                    Logger.error(`Failed to run context menu injection with id ${patch.id}`, e);
                                    return res;
                                }
                            }

                            res.props.children.type = patch.memo;

                            return res;
                        });

                        patch.applied = true;
                    }

                    delete menuPatches[displayName]

                    wrapped.type = AnalyticsContext.default;
                }

                return res
            }
        }

        return args
    })

    Events.addEventListener("reload-core", () => {
        Patcher.unpatchAll("pc-context-menu-opener")
        for (const menu of Object.keys(menuPatches)) {
            const items = menuPatches[menu];
            items.map(e => Patcher.unpatchAll(e.id));
        }
    });
})

export function injectContextMenu(id, name, func, before = false) {
    menuPatches[name] ??= [];
    menuPatches[name].push({id, name, func, before});
}
