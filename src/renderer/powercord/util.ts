import {DiscordModules} from "../modules";

export function findInTree(tree = {}, filter = _ => _, {ignore = [], walkable = [], maxProperties = 100} = {}) {
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

export function getOwnerInstance(node: any) {
    if (!node) return null;
    const fiber = getReactInstance(node);
    let current = fiber;

    while (!(current?.stateNode instanceof DiscordModules.React.Component)) {
        current = current.return;
    }

    return current?.stateNode;
}

export function forceUpdateElement(selector: string) {
    const instance = getOwnerInstance(document.querySelector(selector));
    if (instance) instance.forceUpdate();
};