import DiscordModules from "../../modules/discord";
import ErrorBoundary from "../../powercord/components/errorboundary";

export default function SettingsPanel({store, name, children, header = null}) {
    const [, forceUpdate] = DiscordModules.React.useReducer(n => n + 1, 0);

    DiscordModules.React.useEffect(() => {
        store.addChangeListener(forceUpdate);

        return () => {
            store.removeChangeListener(forceUpdate);
        };
    }, [store]);

    return (
        <ErrorBoundary>
            <div className="pc-settings-panel">
                <div className="pc-settings-title">
                    {name}
                    {header}
                </div>
                {children()}
            </div>
        </ErrorBoundary>
    );
}