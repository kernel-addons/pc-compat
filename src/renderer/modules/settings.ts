import Patcher from "./patcher";
import Webpack from "./webpack";
import DiscordModules from './discord';
import SettingsPanel from "../ui/components/settingspanel";
import {getSettings} from "../powercord/classes/settings";

export default class SettingsRenderer {
    static panels: any[] = [
        {section: "DIVIDER"},
        {
            section: "HEADER",
            label: "Powercord",
        },
    ];

    static registerPanel(id: string, options: {label: string, render: () => import("react").ReactElement, header?: import("react").ReactElement}) {
        const {label, render} = options;
        const tab = this.panels.find(e => e.id === id)
        
        if (tab) throw new Error(`Settings tab ${id} is already registered!`);

        const panel = {
            section: "PCCompat-" + label,
            label: label,
            id: id,
            className: `pccompat-settings-${id}-item`,
            element: () => DiscordModules.React.createElement(SettingsPanel, {
                name: label,
                store: getSettings(id),
                children: render,
                header: options.header ?? null
            })
        };

        this.panels.push(
            panel
        );

        return () => {
            const index = this.panels.indexOf(panel);
            if (index < 0) return false;
            this.panels.splice(index, 1);
            return true;
        };
    }

    static unregisterPanel(id: string) {
        const panel = this.panels.findIndex(e => e.id === id);
        if (panel < 0) return;

        this.panels.splice(panel, 1);
    }

    static patchSettingsView() {
        const SettingsView = Webpack.findByDisplayName("SettingsView");
    
        Patcher.after("PCSettings", SettingsView.prototype, "getPredicateSections", (_, __, res) => {
            if (!Array.isArray(res) || !res.some(e => e?.section?.toLowerCase() === "changelog") || res.some(s => s?.id === "pc-settings")) return;

            const index = res.findIndex(s => s?.section?.toLowerCase() === "changelog") - 1;
            if (index < 0) return;

            res.splice(index, 0, ...SettingsRenderer.panels);
        });
    }
}