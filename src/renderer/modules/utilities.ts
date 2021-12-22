import DiscordModules from "./discord";

export function sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
};

export function random(length = 10): string {
    return Math.random().toString(36).slice(2, length + 2);
};

export function getProps(obj: any, path: string) {
    if (!path) return obj;
    return path.split(".").reduce((value, key) => value && value[key], obj);
};

export function setProps(object: any, path: string, value: any) {
    if (!path) return object;
    const split = path.split(".");
    const prop = split.pop();
    let current = split.length ? getProps(object, split.join(".")) : object;
    if (!current) return object;
    current[prop] = value;
    return object;
};

export const createUpdateWrapper = (Component, valueProp = "value", changeProp = "onChange", valueProps = "0", valueIndex = 0) => props => {
    const [value, setValue] = DiscordModules.React.useState(props[valueProp]);

    return DiscordModules.React.createElement(Component, {
        ...props,
        [valueProp]: value,
        [changeProp]: (...args) => {
            const value = getProps(args, valueProps);
            if (typeof props[changeProp] === "function") props[changeProp](args[valueIndex]);
            setValue(value);
        }
    });
};

export function omit(thing: any[] | object, ...things) {
    if (Array.isArray(thing)) {
        return thing.reduce((clone, key) => things.includes(key) ? clone : clone.concat(key), []);
    }

    const clone = {};
    for (const key in thing) {
        if (things.includes(key)) continue;
        clone[key] = thing[key];
    }

    return clone;
};

export function joinClassNames(...classNames: (string | [boolean, string])[]) {
    let className = [];

    for (const item of classNames) {
        if (typeof (item) === "string") {
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

export function matchAll(regex: RegExp, input: string, parent = false) {
    let matches: RegExpExecArray, output: (string[])[] = [];

    while(matches = regex.exec(input)) {
        if (parent) output.push(matches);
        else {
            const [, ...match] = matches;
            output.push(match);
        }
    }

    return output;
};

export function uuid(length = 30) {
    let uuid = "";

    do {
        const random = Math.random() * 16 | 0;
        uuid += (uuid.length == 12 ? 4 : (uuid.length == 16 ? (random & 3 | 8) : random)).toString(16);
    } while(uuid.length < length);

    return uuid;
}