import Webpack, {Filters} from "@modules/webpack";
import {joinClassNames} from "@modules/utilities";
import DiscordModules from "@modules/discord";
import LoggerModule from "@modules/logger";
import Patcher from "@modules/patcher";
import Events from "@modules/events";
import Clyde from "@modules/clyde";

import Icon from "./components/SectionIcon";

const Logger = LoggerModule.create("Commands");

export const commands = new Map();

export const section = {
    id: "powercord",
    type: 0,
    name: "Powercord",
    icon: "https://github.com/powercord-org.png"
};

export function initialize() {
    const [
        CommandsStore,
        Icons,
        SearchStore,
        Classes,
        SectionIcon,
        ApplicationCommandItem,
        ChannelApplicationIcon
    ] = Webpack.bulk(
        Filters.byProps("getBuiltInCommands"),
        Filters.byProps("getApplicationIconURL"),
        Filters.byProps("useSearchManager"),
        Filters.byProps("icon", "selectable", "wrapper"),
        Filters.byDisplayName("ApplicationCommandDiscoverySectionIcon", true),
        Filters.byDisplayName("ApplicationCommandItem", true),
        m => m.type.displayName === "ChannelApplicationIcon"
    );

    Patcher.before("PowercordCommands", ChannelApplicationIcon, 'type', (_, [props]) => {
        if (!props.section && props.command.__powercord) {
           props.section = section;
        }
     });

     Patcher.before("PowercordCommands", ApplicationCommandItem, 'default', (_, [props]) => {
        if (!props.section && props.command.__powercord) {
           props.section = section;
        }
     });

    Patcher.instead("PowercordCommands", SectionIcon, "default", (self, args, orig) => {
        const [props] = args;
        const isSmall = props.selectable === void 0;

        if (props.section.id === section.id) {
            const metadata = joinClassNames(Classes.wrapper, props.selectable && Classes.selectable, props.selectable && props.isSelected && Classes.selected);

            return (
                <div className={metadata}>
                    <Icon
                        width={props.width}
                        height={props.height}
                        className={joinClassNames(Classes.icon, props.className)}
                        style={{
                            width: `${props.width}px`,
                            height: `${props.height}px`,
                            padding: !isSmall ? "4px" : 0,
                            paddingBottom: !isSmall ? "1px" : 0
                        }}
                    />
                </div>
            );
        }

        return orig.apply(self, args);
    });

    CommandsStore.BUILT_IN_SECTIONS["powercord"] = section;
    Patcher.instead("PowercordCommands", Icons, "getApplicationIconURL", (self, args, orig) => {
        if (args[0]?.id === section.id) {
            return section.icon;
        }

        return orig.apply(self, args);
    });

    Patcher.instead("PowercordCommands", SearchStore.default, "getApplicationSections", (self, args, orig) => {
        try {
            const res = orig.apply(self, args) ?? [];

            if (!res.find(r => r.id === section.id)) {
                res.push(section);
            };

            return res;
        } catch {
            return [];
        }
    });

    Patcher.after("PowercordCommands", SearchStore.default, "getQueryCommands", (_, [, , query], res) => {
        if (!query || query.startsWith("/")) return;
        res ??= [];

        for (const command of commands.values()) {
            if (!~command.name?.indexOf(query) || res.some(e => e.__powercord && e.id === command.id)) {
                continue;
            }

            try {
                res.unshift(command);
            } catch {
                // Discord calls Object.preventExtensions on the result when switching channels
                // Therefore, re-making the result array is required.
                res = [...res, command];
            }
        }
    });

    Patcher.after("PowercordCommands", SearchStore, "useSearchManager", (_, [, type], res) => {
        if (type !== 1 || !commands.size) return res;

        if (!res.sectionDescriptors?.find?.(s => s.id === section.id)) {
            res.sectionDescriptors ??= [];
            res.sectionDescriptors.push(section);
        }

        if ((!res.filteredSectionId || res.filteredSectionId === section.id) && !res.activeSections.find(s => s.id === section.id)) {
            res.activeSections.push(section);
        }

        const cmds = [...commands.values()];
        if (cmds.some(c => !res.commands?.find?.(r => c.__powercord && r.id === c.id))) {
            res.commands ??= [];

            // De-duplicate commands
            const collection = [...res.commands, ...cmds];
            res.commands = [...new Set(collection).values()];
        }

        if ((!res.filteredSectionId || res.filteredSectionId === section.id) && !res.commandsByActiveSection.find(r => r.section.id === section.id)) {
            res.commandsByActiveSection.push({
                section: section,
                data: cmds
            });
        }

        const active = res.commandsByActiveSection.find(r => r.section.id === section.id);
        if ((!res.filteredSectionId || res.filteredSectionId === section.id) && active && active.data.length === 0 && commands.size !== 0) {
            active.data = cmds
        }

        /*
         * Filter out duplicate built-in sections due to a bug that causes
         * the getApplicationSections path to add another built-in commands
         * section to the section rail
        */

        const builtIn = res.sectionDescriptors.filter(s => s.id === "-1");
        if (builtIn.length > 1) {
            res.sectionDescriptors = res.sectionDescriptors.filter(s => s.id !== "-1");
            res.sectionDescriptors.push(builtIn.find(r => r.id === "-1"));
        }

        return res;
    });

    Events.addEventListener("reload-core", () => {
        Patcher.unpatchAll("PowercordCommands");
    });
};

export async function handleCommand(options, args) {
    const { command, executor } = options;

    try {
        const channel = DiscordModules.SelectedChannelStore.getChannelId();

        const res = await executor(args);

        if (!res || !res.result) return;

        if (!res.send) {
            const options: {
                content?: string;
                embeds?: object[];
            } = { embeds: [] };

            if (typeof res.result === "string") {
                options.content = res.result;
            } else {
                options.embeds.push(res.result);
            }

            Clyde.sendMessage(channel, options);
        } else {
            DiscordModules.MessageActions.sendMessage(channel, {
                content: res.result,
                invalidEmojis: [],
                validNonShortcutEmojis: [],
                tts: false
            });
        };
    } catch (error) {
        Logger.error(`Could not executor for ${options.command}-${command}:`, error);

        Clyde.sendMessage(void 0, {
            content: ":x: An error occurred while running this command. Check your console."
        });
    }
}


export function registerCommand(options: any) {
    const { command, executor, ...cmd } = options;

    commands.set(command, {
        type: 0,
        target: 1,
        id: command,
        name: command,
        applicationId: section.id,
        dmPermission: true,
        listed: true,
        __powercord: true,
        options: [
            {
                type: 3,
                required: false,
                description: `Usage: ${cmd.usage?.replace?.(/{c}/g, command) ?? command}`,
                name: "args"
            }
        ],
        ...cmd,
        execute: async (result: any) => {
            try {
                handleCommand(options, Object.values(result).map((e: any) => e.value) ?? []);
            } catch (error) {
                Logger.error(error);
            }
        }
    });
};

export function unregisterCommand(id: string) {
    commands.delete(id);
}
