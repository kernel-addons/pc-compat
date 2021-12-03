import DiscordModules, {promise} from "@modules/discord";
import ErrorBoundary from "@powercord/components/errorboundary";

export let SettingsContext = null;

promise.then(() => {
    SettingsContext = DiscordModules.React.createContext();
});

export default function SettingsPanel({store, name, children, header = null}) {
    const {Caret} = DiscordModules;
    const [, forceUpdate] = DiscordModules.React.useReducer(n => n + 1, 0);
    const [subPage, setSubPage] = DiscordModules.React.useState({label: "", render: null});
    const hasSubPage = DiscordModules.React.useMemo(() => {
        return typeof (subPage.render) === "function" && subPage.label;
    }, [subPage]);

    DiscordModules.React.useEffect(() => {
        store.addChangeListener(forceUpdate);

        return () => {
            store.removeChangeListener(forceUpdate);
        };
    }, [store]);

    const API = {
        setPage(options: {label: string, render: () => React.ReactElement}) {
            setSubPage(options);
        },
        reset() {
            setSubPage({render: null, label: ""});
        }
    };

    return (
        <ErrorBoundary>
            <SettingsContext.Provider value={API}>
                <div className="pc-settings-panel">
                    <div className="pc-settings-title">
                        {hasSubPage ? (
                            <div className="pc-settings-title-name" onClick={() => API.reset()}>
                                {name}
                            </div>
                        ) : name}
                        {hasSubPage ? (
                            <React.Fragment>
                                <Caret
                                    direction={Caret.Directions.RIGHT}
                                    className="pc-settings-title-caret"
                                />
                                <div className="pc-settings-title-sub">{subPage.label}</div>
                            </React.Fragment>
                        ): null}
                        {header}
                    </div>
                    {hasSubPage ? subPage.render() : children()}
                </div>
            </SettingsContext.Provider>
        </ErrorBoundary>
    );
}