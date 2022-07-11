import Webpack from "./webpack";
import Patcher from "./patcher";
import DiscordModules from "./discord";
import SettingsPanel from "@ui/components/settingspanel";
import {getSettings} from "@powercord/classes/settings";
import memoize from "./memoize";
import {getOwnerInstance} from "@powercord/util";
import Events from "./events";
import Powercord from '@ui/icons/powercord';

const SettingsRenderer = new class SettingsRenderer {
    panels: any[] = [];

    promises = {
        cancelled: false,
        cancel() {this.cancelled = true;}
    };

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
        this.injectPanel(panel);
    }

    injectPanels() {
        if (window.isUnbound) return;
        
        for(const panel of this.panels) {
            try {
                this.injectPanel(panel);
            } catch {}
        }
    }

    injectPanel(data) {
        if (window.isUnbound || !window.KernelSettings) return;

        if (KernelSettings.panels.find(e => e.id === ("kernel-settings-powercord-" + data.label))) return;

        return KernelSettings.register("powercord-" + data.label, {
            ...data,
            render: data.element,
            icon: React.createElement(Powercord, {
                className: "pc-logo",
                width: 18,
                height: 18
            })
        })
    }

    sortPanels(a, b) {
        return a.order - b.order;
    }
}

export default SettingsRenderer;
