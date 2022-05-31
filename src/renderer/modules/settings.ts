import Webpack from "./webpack";
import Patcher from "./patcher";
import DiscordModules from "./discord";
import SettingsPanel from "@ui/components/settingspanel";
import {getSettings} from "@powercord/classes/settings";
import memoize from "./memoize";
import {getOwnerInstance} from "@powercord/util";
import Events from "./events";

const SettingsRenderer = new class SettingsRenderer {
    get sidebarClass() {return memoize(this, "sidebarClass", Webpack.findByProps("standardSidebarView"));}

    panels: any[] = [];

    promises = {
        cancelled: false,
        cancel() {this.cancelled = true;}
    };

    defaultPanels = [
        {section: "DIVIDER"},
        {
            section: "HEADER",
            label: "Powercord",
        },
    ];

    filterItems(item: any) {return true;}

    registerPanel(id: string, options: {icon?: React.ReactElement, badgeCount?: number, label: string, render: () => import("react").ReactElement, header?: import("react").ReactElement, order: number, predicate?(): boolean}) {
        const {label, render, order, ...rest} = options;
        const tab = this.panels.find(e => e.id === id)

        if (tab) throw new Error(`Settings tab ${id} is already registered!`);

        const panel = {
            ...rest,
            section: id,
            label: label,
            order: order,
            className: `pccompat-settings-${id}-item`,
            predicate: options.predicate ?? (() => true),
            element: () => DiscordModules.React.createElement(SettingsPanel, {
                name: label,
                store: getSettings(id),
                children: render,
                header: options.header ?? null
            })
        };

        this.panels = this.panels.concat(panel).sort(this.sortPanels);

        return () => {
            const index = this.panels.indexOf(panel);
            if (index < 0) return false;
            this.panels.splice(index, 1);
            return true;
        };
    }

    unregisterPanel(id: string) {
        const panel = this.panels.findIndex(e => e.id === id);
        if (panel < 0) return;

        this.panels.splice(panel, 1);
        this.forceUpdate();
    }

    sortPanels(a, b) {
        return a.order - b.order;
    }

    async patchSettingsView() {
        const SettingsView = await Webpack.findLazy(Webpack.Filters.byDisplayName("SettingsView"));
        if (this.promises.cancelled) return;

        Patcher.after("PCSettings", SettingsView.prototype, "getPredicateSections", (_, __, res) => {
            if (!Array.isArray(res) || !res.some(e => e?.section?.toLowerCase() === "changelog") || res.some(s => s?.id === "pc-settings")) return;

            const index = res.findIndex(s => s?.section?.toLowerCase() === "changelog") - 1;
            if (index < 0) return;
            const panels: any[] = [...this.defaultPanels];

            for (let i = 0; i < this.panels.length; i++) {
                if (this.filterItems(this.panels[i]) && (this.panels[i].predicate && !this.panels[i].predicate())) continue;

                panels.push(this.panels[i]);
            }

            res.splice(index, 0, ...panels);
        });

        Events.addEventListener("reload-core", () => {
            Patcher.unpatchAll("PCSettings");
            this.promises.cancel();
        });
    }

    forceUpdate() {
        const [node] = document.getElementsByName(this.sidebarClass.standardSidebarView);
        if (!node) return;

        const instance = getOwnerInstance(node, e => e?.constructor?.displayName === "SettingsView");
        if (instance) instance.forceUpdate();
    }
}

export default SettingsRenderer;
