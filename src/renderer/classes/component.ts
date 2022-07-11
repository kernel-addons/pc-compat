export default class Component<P = {}, S = {}, C = any> implements React.Component<P, S, C> {
    declare state: S;
    declare props: P;
    declare _isMounted: boolean;
    declare updater: any;
    declare context: C;
    declare refs: any;

    constructor(props: P, context?: C) {
        const render = this.render as any;
        const ComponentContainer = () => render.call(this);

        this.render = () => React.createElement(ComponentContainer);
    }

    render(): React.ReactNode {return null;}

    isMounted() {return !!this._isMounted;}

    forceUpdate(callback?: Function) {this.updater.enqueueForceUpdate(this, callback, "forceUpdate");}

    isReactComponent() {return true;}

    replaceState(state: S, callback?: Function) {this.updater.enqueueReplaceState(this, callback, state);}

    setState(state: S, callback?: Function) {
        if (typeof state !== "object" && typeof state !== "function" && state != null) throw "Silly.";

        this.updater.enqueueSetState(this, state, callback, "setState");
    }
}