import DiscordModules from "@modules/discord";
import LoggerModule from "@modules/logger";

const Logger = LoggerModule.create("FLuxDispatcher");

export default function createDispatcher() {
    const events = {};

    const API = {
        events: events,
        emit(event: any) {
            if (!events[event?.type]) return;

            for (const callback of events[event.type]) {
                try {callback(event);}
                catch (error) {Logger.error(`Could not fire callback for ${event}:`, error);}
            }
        },
        on(event: string, callback: Function) {
            if (!events[event]) events[event] = new Set();

            events[event].add(callback);

            return () => API.off(event, callback);
        },
        off(event: string, callback: Function) {
            if (!events[event]) return;

            return events[event].delete(callback);
        },
        once(event: string, callback: Function) {
            const unsubscribe = API.on(event, (event: any) => {
                unsubscribe();
                return Reflect.apply(callback, null, [event]);
            });
            return unsubscribe;
        },
        useComponentDispatch: function useComponentDispatch(event: string, callback: Function) {
            DiscordModules.React.useEffect(() => API.on(event, callback));
        }
    };

    return API;
}