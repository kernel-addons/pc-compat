import DiscordModules from "./discord";

export default function createStore(state: any) {
    const {useEffect, useReducer} = DiscordModules.React;
    const listeners = new Set<Function>();

    const api = {
        getState() {return state;},
        setState(partial: any) {
            const partialState = typeof partial === "function" ? partial(state) : partial;
            if (Object.is(partialState, state)) return;
            state = Array.isArray(state) ? [...new Set([...partial, ...state])] : Object.assign({}, state, partialState);
            listeners.forEach(listener => {
                listener(state);
            });
        },
        get listeners() {return listeners;},
        on(listener: Function) {
            if (listeners.has(listener)) return;
            listeners.add(listener);

            return () => listeners.delete(listener);
        },
        off(listener: Function) {
            return listeners.delete(listener);
        }
    };

    function useState(collector = _ => _) {
        const forceUpdate = useReducer(e => e + 1, 0)[1];
        useEffect(() => {
            const handler = () => forceUpdate();

            listeners.add(handler);

            return () => void listeners.delete(handler);
        }, []);

        return collector(api.getState());
    }

    return [useState, api];
}