import LoggerModule from "@modules/logger";
import DiscordModules from "@modules/discord";

export type ValidateListener = (...args: any[]) => boolean;

export default class Store<events = string> {
    logger = new LoggerModule("Store");

    events: {[event: string]: Set<Function>} = {};

    has(event: events): boolean {return event in this.events;}

    on(event: events, listener: Function) {
        if (!this.has(event)) this.events[event as unknown as string] = new Set<Function>();

        this.events[event as unknown as string].add(listener);

        return () => void this.off(event, listener);
    }

    off(event: events, listener: Function) {
        if (!this.has(event)) return;

        return this.events[event as unknown as string].delete(listener);
    }

    emit(event: events, ...args: any[]) {
        if (!this.has(event)) return;
        const toFire = [...this.events[event as unknown as string]];

        for (let index = 0; index < toFire.length; index++) {
            const listener = toFire[index];
            
            try {listener(...args);}
            catch (error) {this.logger.error(`Store:${this.constructor.name}`, error);}
        }
    }

    useEvent(event: events, factory: Function, validate: ValidateListener = () => true) {
        const [state, setState] = DiscordModules.React.useState(factory());
        DiscordModules.React.useEffect(() => {
            return this.on(event, (...args) => validate(...args) && setState(factory()));
        }, [event, factory]);

        return state;
    }
}