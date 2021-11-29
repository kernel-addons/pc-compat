import {DiscordModules} from "../../modules";

export default function AsyncComponent({_provider, _fallback, ...props}) {
    const [Component, setComponent] = DiscordModules.React.useState(() => (_fallback ?? (() => null)));

    DiscordModules.React.useEffect(() => {
        _provider().then(comp => setComponent(() => comp));
    }, [_provider, _fallback]);
    
    return (
        <Component {...props} />
    );
};

export function from(promise: Promise<any>, fallback?: any) {
    return props => DiscordModules.React.createElement(AsyncComponent, {
        _provider: () => promise,
        _fallback: fallback,
        ...props
    });
};

// Alias
export const fromPromise = from;
// TODO: Finish AsyncComponent
// export function fromDisplayName(displayName: string) {
//     return from(get)
// }