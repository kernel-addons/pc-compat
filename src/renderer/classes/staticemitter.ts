import Logger from "../modules/logger";

export default class Emitter {
    static events: {[event: string]: Set<Function>;} = {};

    static has(event: string): boolean {return event in this.events;}

    static on(event: string, listener: Function): () => boolean {
        if (!this.has(event)) this.events[event] = new Set<Function>();

        this.events[event].add(listener);

        return this.off.bind(this, event, listener);
    }

    static off(event: string, listener: Function): boolean {
        if (!this.has(event)) return;

        return this.events[event].delete(listener);
    }

    static emit(event: string, ...args: any[]): void {
        if (!this.has(event)) return;

        for (const listener of this.events[event]) {
            try {listener(...args);}
            catch (error) {
                Logger.error(`Store:${this.constructor.name}`, "Could not fire callback:", error);
            }
        }
    }
}