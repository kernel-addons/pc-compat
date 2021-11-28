export default function memoize<T = any>(target: any, key: string, value: T): T {
    Object.defineProperty(target, key, {
        value: value,
        configurable: true
    });

    return value;
};