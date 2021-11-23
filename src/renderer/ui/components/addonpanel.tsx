import {DataStore, DiscordModules} from "../../modules";
import Components from "../../modules/components";
import AddonCard from "./addoncard";

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
    console.log({order, query, searchOptions});
    return addons
        .filter(addon => {
            if (!query) return true;
            const {manifest} = addon;
            // Use String() wrapper for clever escaping
            return ["name", "author", "description"].some(type => searchOptions[type] && ~String(manifest[type] ?? "").toLowerCase().indexOf(query));
        })
        .sort((a, b) => {
            const first = a.manifest[sortBy] ?? "";
            const second = b.manifest[sortBy] ?? "";
            if (typeof (first) === "string") return String(first).toLowerCase().localeCompare(String(second).toLowerCase());
            if (first > second) return 1;
            if (second > first) return -1;

            return 0;
        })
        [order === "ascending" ? "reverse" : "slice"](0);
};

export function OverflowContextMenu({type: addonType}) {
    const {default: ContextMenu, MenuRadioItem, MenuCheckboxItem, MenuControlItem, MenuSeparator, MenuGroup} = Components.byProps("MenuItem", "default");
    const [sortBy, searchOptions, order] = DataStore.useEvent("misc", () => [
        DataStore.getMisc(`${addonType}.sortBy`, "name"),
        DataStore.getMisc(`${addonType}.searchOption`, {}),
        DataStore.getMisc(`${addonType}.order`, "descending")
    ]);

    return (
        <ContextMenu navId="OverflowContextMenu">
            <MenuControlItem
                id="order-header"
                control={() => (
                    <h5 className="pc-settings-overflow-header">Order</h5>
                )}
            />
            <MenuSeparator key="separator" />
            <MenuGroup>
                {orderLabels.map(type => (
                    <MenuRadioItem
                        key={"order-" + type}
                        label={type[0].toUpperCase() + type.slice(1)}
                        checked={order === type}
                        id={"sortBy-" + type}
                        action={() => {
                            DataStore.setMisc(void 0, `${addonType}.order`, type);
                        }}
                    />
                ))}
            </MenuGroup>
            <MenuSeparator key="separator" />
            <MenuControlItem
                id="sort-header"
                control={() => (
                    <h5 className="pc-settings-overflow-header">Sort Options</h5>
                )}
            />
            <MenuSeparator key="separator" />
            <MenuGroup>
                {sortLabels.map(type => (
                    <MenuRadioItem
                        key={"sortBy-" + type}
                        label={type[0].toUpperCase() + type.slice(1)}
                        checked={sortBy === type}
                        id={"sortBy-" + type}
                        action={() => {
                            DataStore.setMisc(void 0, `${addonType}.sortBy`, type);
                        }}
                    />
                ))}
            </MenuGroup>
            <MenuSeparator key="separator" />
            <MenuControlItem
                id="search-header"
                control={() => (
                    <h5 className="pc-settings-overflow-header">Search Options</h5>
                )}
            />
            <MenuSeparator key="separator" />
            <MenuGroup>
                {searchLabels.map(type => (
                    <MenuCheckboxItem
                        key={"search-" + type}
                        id={"search-" + type}
                        label={type[0].toUpperCase() + type.slice(1)}
                        checked={searchOptions[type] ?? true}
                        action={() => {
                            DataStore.setMisc(void 0, `${addonType}.searchOption.${type}`, !(searchOptions[type] ?? true));
                        }}
                    />
                ))}
            </MenuGroup>
        </ContextMenu>
    );
};

export default function AddonPanel({manager, type}) {
    const {React} = DiscordModules;
    const [query, setQuery] = React.useState("");
    const [addons, setAddons] = React.useState(null);
    const [sortBy, searchOptions, order] = DataStore.useEvent("misc", () => [
        DataStore.getMisc(`${type}.sortBy`, "name"),
        DataStore.getMisc(`${type}.searchOption`, {}),
        DataStore.getMisc(`${type}.order`, "descending")
    ]);
    const {ContextMenuActions} = DiscordModules;
    const SearchBar = Components.get("SearchBar");
    const Spinner = Components.get("Spinner");
    const OverflowMenu = Components.get("OverflowMenu");
    const Tooltip = Components.get("Tooltip");
    const Button = Components.byProps("DropdownSizes");
    // const classes = Components.byProps("");

    React.useEffect(() => {
        sortAddons(
            Array.from(manager.addons),
            order ?? "descending",
            query,
            searchOptions ?? {author: true, name: true, description: true},
            sortBy
        ).then(addons => setAddons(addons));
    }, [query, manager, type, order, searchOptions, sortBy]);

    return (
        <div className="pc-settings-addons">
            <div className="pc-settings-addons-controls">
                <SearchBar
                    // @ts-ignore
                    onQueryChange={(value) => setQuery(value)}
                    onClear={() => setQuery("")}
                    placeholder={`Search ${type}s...`}
                    size={SearchBar.Sizes.SMALL}
                    query={query}
                    className="pc-settings-addons-search"
                />
                <Tooltip text="Options" position="bottom">
                    {props => (
                        <Button
                            {...props}
                            size={Button.Sizes.NONE}
                            look={Button.Looks.BLANK}
                            className="pc-settings-overflow-menu"
                            onClick={e => {
                                ContextMenuActions.openContextMenu(e, () => (
                                    <OverflowContextMenu type={type} />
                                ));
                            }}>
                            <OverflowMenu />
                        </Button>
                    )}
                </Tooltip>
            </div>
            <div className="pc-settings-card-scroller">
                {addons
                    ? addons.map(addon => <AddonCard
                        addon={addon}
                        hasSettings={false}
                        manager={manager}
                        type={type}
                        key={addon.manifest.name}
                        openSettings={() => {}}
                    />)
                    : <Spinner type={Spinner.Type.WANDERING_CUBES} />
                }
            </div>
        </div>
    );
};