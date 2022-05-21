export default function memoize<T = any>(target: any, key: string, value: T): T {
    Object.defineProperty(target, key, {
        value: value,
        configurable: true
    });

    return value;
};

export function memoizeValue<T = any>(factory: (...args: any[]) => T) {
    let cache: T = null;

    const memo = (...args: any[]) => {
        if (cache) return cache;
        cache ??= factory(...args);
        return cache;
    };
    memo.expire = () => cache = null;

    return memo;
}