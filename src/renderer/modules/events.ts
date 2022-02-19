
const Events: EventTarget & {
    addEventListener(event: "reload-css" | "reload-core", listener: (event: Event) => void, once?: boolean): void;
    removeEventListener(event: "reload-css" | "reload-core", listener: (event: Event) => void): void;
} = new EventTarget();

export default Events;