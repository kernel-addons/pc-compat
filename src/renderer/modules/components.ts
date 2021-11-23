import Webpack from "../modules/webpack.js";

export default class Components {
    static #_cache = {};

    static byProps(...props: string[]) {
        const name = props.join(":");
        if (this.#_cache[name]) return this.#_cache[name];

        this.#_cache[name] = Webpack.findModule(m => props.every(p => p in m) && ("default" in m ? true : typeof(m) === "function"));

        return this.#_cache[name];
    }

    static get(name: string, filter = _ => _) {
        if (this.#_cache[name]) return this.#_cache[name];

        this.#_cache[name] = Webpack.findModule(m => m.displayName === name && filter(m));

        return this.#_cache[name];
    }
}