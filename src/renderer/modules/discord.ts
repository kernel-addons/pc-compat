import Webpack from "./webpack";
import {Modules} from "@data";

const DiscordModules: {[key in keyof typeof Modules]: any} = {} as unknown as any;
const NOOP_RET = _ => _;
const filters = new Promise<any[]>(resolve => {
    const result = [];

    for (let moduleId in Modules) {
        const module = Modules[moduleId];
        let filter = NOOP_RET, map = null;

        if (Array.isArray(module.props)) {
            switch (module.type) {
                case "MERGE": {
                    let found = [];

                    filter = (m: any) => {
                        const matches = module.props.some((props: string[]) => props.every(prop => prop in m));
                        if (matches) found.push(m);

                        return matches;
                    };

                    map = () => {
                        return Object.assign({}, ...found);
                    };

                    break;
                };

                default: {
                    filter = (m: any) => module.props.every((prop: string) => prop in m);
                }
            }
        }

        if (module.rename) {
            const current = map ?? NOOP_RET;
            map = (mod: any) => {
                mod = current(mod);
                const cloned = {...mod};

                for (const {from, to} of module.rename) {
                    cloned[to] = mod[from];
                    delete cloned[from];
                }

                return cloned;
            };
        }

        if (module.name) {
            const current = filter;
            filter = (mod: any) => (
                Array.isArray(module.name)
                    ? module.name.some((name: string) => mod.displayName === name)
                    : mod.displayName === module.name
            ) && current(mod);
        }

        if (typeof (module.ensure) === "function") {
            const current = filter;
            filter = (mod: any) => current(mod) && module.ensure(mod);
        }

        if (typeof (filter) !== "function") continue;

        result.push({filter, map, id: moduleId});
    }

    resolve(result);
});

export const promise = Promise.all([filters, Webpack.whenReady]).then(([filters]) => {
    const result = Webpack.bulk(...filters.map(({filter}) => filter));

    Object.assign(DiscordModules,
        filters.reduce((modules, {id, map}, index) => {
            const mapper = map ?? NOOP_RET;
            if (!result[index]) return modules;
            const res = mapper(result[index]);
            modules[id] = res;

            if (id == 'React') Object.defineProperty(window, 'React', {
                value: res,
                configurable: true,
                writable: true
            });

            return modules;
        }, {})
    );
});

export default DiscordModules;