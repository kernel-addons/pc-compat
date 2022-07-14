import {DataStore, DiscordModules} from "@modules";
import DiscordIcon from "@ui/discordicon";
import AddonCard from "./addoncard";
import {electron} from "@node";

export type SearchOptions = {
    description: boolean;
    author: boolean;
    name: boolean;
};

export type SortOption = "name" | "author" | "description" | "added";

const sortLabels = ["name", "author", "version", "description", "added"];
const searchLabels = ["name", "author", "description"];
const orderLabels = ["ascending", "descending"];

export async function sortAddons(addons: any[], order: "ascending" | "descending", query: string, searchOptions: SearchOptions, sortBy: SortOption) {
    return addons
        .filter(addon => {
            if (!query) return true;
            const {manifest} = addon;
            // Use String() wrapper for clever escaping
            return ["name", "author", "description"].some(type => searchOptions[type] && String(manifest[type] ?? "").toLowerCase().includes(query.toLowerCase()));
        })
        .sort((a, b) => {
            const first = a.manifest[sortBy] ?? "";
            const second = b.manifest[sortBy] ?? "";
            if (typeof (first) === "string") return String(first).toLowerCase().localeCompare(String(second).toLowerCase());
            if (first > second) return 1;
            if (second > first) return -1;

            return 0;
        }).filter(Boolean)
    [order === "ascending" ? "reverse" : "slice"](0);
};

export function OverflowContextMenu({type: addonType}) {
    const {ContextMenu} = DiscordModules;

    const [sortBy, searchOptions, order] = DataStore.useEvent("misc", () => [
        DataStore.getMisc(`${addonType}.sortBy`, "name"),
        DataStore.getMisc(`${addonType}.searchOption`, {author: true, name: true, description: true}),
        DataStore.getMisc(`${addonType}.order`, "descending")
    ]);

    return (
        <ContextMenu.Menu navId="OverflowContextMenu">
            <ContextMenu.ControlItem
                id="order-header"
                control={() => (
                    <h5 className="pc-settings-overflow-header">Order</h5>
                )}
            />
            <ContextMenu.Separator key="separator" />
            <ContextMenu.Group>
                {orderLabels.map(type => (
                    <ContextMenu.RadioItem
                        key={"order-" + type}
                        label={type[0].toUpperCase() + type.slice(1)}
                        checked={order === type}
                        id={"sortBy-" + type}
                        action={() => {
                            DataStore.setMisc(void 0, `${addonType}.order`, type);
                        }}
                    />
                ))}
            </ContextMenu.Group>
            <ContextMenu.Separator key="separator" />
            <ContextMenu.ControlItem
                id="sort-header"
                control={() => (
                    <h5 className="pc-settings-overflow-header">Sort Options</h5>
                )}
            />
            <ContextMenu.Separator key="separator" />
            <ContextMenu.Group>
                {sortLabels.map(type => (
                    <ContextMenu.RadioItem
                        key={"sortBy-" + type}
                        label={type[0].toUpperCase() + type.slice(1)}
                        checked={sortBy === type}
                        id={"sortBy-" + type}
                        action={() => {
                            DataStore.setMisc(void 0, `${addonType}.sortBy`, type);
                        }}
                    />
                ))}
            </ContextMenu.Group>
            <ContextMenu.Separator key="separator" />
            <ContextMenu.ControlItem
                id="search-header"
                control={() => (
                    <h5 className="pc-settings-overflow-header">Search Options</h5>
                )}
            />
            <ContextMenu.Separator key="separator" />
            <ContextMenu.Group>
                {searchLabels.map(type => (
                    <ContextMenu.CheckboxItem
                        key={"search-" + type}
                        id={"search-" + type}
                        label={type[0].toUpperCase() + type.slice(1)}
                        checked={searchOptions[type]}
                        action={() => {
                            DataStore.setMisc(void 0, `${addonType}.searchOption.${type}`, !(searchOptions[type]));
                        }}
                    />
                ))}
            </ContextMenu.Group>
        </ContextMenu.Menu>
    );
};

export default function AddonPanel({manager, type}) {
    const {React, SearchBar, PlaceholderClasses, Popout, LocaleManager: {Messages}} = DiscordModules;

    const [query, setQuery] = React.useState("");
    const [addons, setAddons] = React.useState(manager.addons);
    const [sortBy, searchOptions, order] = DataStore.useEvent("misc", () => [
        DataStore.getMisc(`${type}.sortBy`, "name"),
        DataStore.getMisc(`${type}.searchOption`, {author: true, name: true, description: true}),
        DataStore.getMisc(`${type}.order`, "descending")
    ]);

    React.useEffect(() => {
        manager.on("delete", () => {
            setAddons(manager.addons);
        });

        manager.on("updated", () => {
            setAddons(manager.addons);
        });
    }, [manager]);

    React.useEffect(() => {
        sortAddons(
            Array.from(manager.addons),
            order,
            query,
            searchOptions,
            sortBy
        ).then(addons => setAddons(addons));
    }, [query, manager, type, order, searchOptions, sortBy]);

    return (
        <div className="pc-settings-addons">
            <div className="pc-settings-addons-controls">
                <SearchBar
                    onQueryChange={(value) => setQuery(value)}
                    onClear={() => setQuery("")}
                    placeholder={`Search ${type}s...`}
                    size={SearchBar.Sizes.SMALL}
                    query={query}
                    className="pc-settings-addons-search"
                />
                <div className="pc-settings-addons-buttons">
                    <div className="pc-settings-addon-panel-button" onClick={() => manager.loadAll(true)}>
                        <DiscordIcon name="Replay" width={24} height={24} />
                        <div className="pc-settings-addon-panel-button-text">
                            Load Missing
                        </div>
                    </div>
                    <div className="pc-settings-addon-panel-button" onClick={() => electron.shell.openPath(manager.folder)}>
                        <DiscordIcon name="Folder" width={24} height={24} />
                        <div className="pc-settings-addon-panel-button-text">
                            Open Folder
                        </div>
                    </div>
                    <Popout
                        position={Popout.Positions.TOP}
                        animation={Popout.Animation.FADE}
                        align={Popout.Align.RIGHT}
                        spacing={12}
                        renderPopout={() => (
                            <OverflowContextMenu type={type} />
                        )}
                    >
                        {popoutProps => (
                            <div {...popoutProps} className="pc-settings-addon-panel-button">
                                <DiscordIcon name="OverflowMenu" width={24} height={24} />
                            </div>
                        )}
                    </Popout>
                </div>
            </div>
            <div className="pc-settings-card-scroller">
                {addons?.length
                    ? addons.map(addon => <AddonCard
                        addon={addon}
                        hasSettings={false}
                        manager={manager}
                        type={type}
                        key={addon.manifest?.name}
                        openSettings={() => {}}
                    />)
                    : <div className="pc-settings-empty">
                        <div className={PlaceholderClasses?.emptyStateImage} />
                        <p>{Messages.GIFT_CONFIRMATION_HEADER_FAIL}</p>
                        <p>{Messages.SEARCH_NO_RESULTS}</p>
                    </div>
                }
            </div>
        </div >
    );
};