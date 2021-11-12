export default function memoize<T = any>(target: any, key: string, getter: () => T): T {
    const value = getter();

    Object.defineProperty(target, key, {
        value: value,
        configurable: true
    });

    return value;
};