import DiscordModules from "@modules/discord";

export default function createForceUpdate() {
    const refs: Set<Function> = new Set();

    const forceUpdate = function () {
        for (const ref of [...refs]) {
            try {ref();}
            catch (error) {console.error(error);}
        }
    };

    function useForceUpdate() {
        const [, forceUpdate] = DiscordModules.React.useReducer(n => !n, false);

        DiscordModules.React.useEffect(() => {
            refs.add(forceUpdate);

            return refs.delete.bind(refs, forceUpdate);
        }, []);
    }

    return [forceUpdate, useForceUpdate];
}