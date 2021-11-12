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
}