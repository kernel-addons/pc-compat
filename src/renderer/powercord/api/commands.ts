import Webpack from "@modules/webpack";
import LoggerModule from "@modules/logger";
import Patcher from "@modules/patcher";
import Clyde from "@modules/clyde";
import DiscordModules from "@modules/discord";
import {findInReactTree} from "@powercord/util";
import Events from '@modules/events';

const Logger = LoggerModule.create("Commands");

export const commands = new Map();

export const section = {
    id: "powercord",
    type: 1,
    name: "Powercord",
    icon: "https://cdn.discordapp.com/attachments/891039688352219198/908403940738093106/46755359.png"
};

export function initialize() {
    const [AssetUtils, CommandUtils, Commands] = Webpack.findByProps(
        ["getApplicationIconURL"],
        ["useApplicationCommandsDiscoveryState"],
        ["queryCommands"],
        {bulk: true}
    );

    const Icon = Webpack.findByDisplayName("ApplicationCommandDiscoveryApplicationIcon", { default: true });
    Patcher.after("PowercordCommands", Icon, "default", (_, [props], res) => {
        if (props.section.id === section.id) {
            const img = findInReactTree(res, r => r.props.src);
            img.props.src = section.icon;
        }
    })

    Patcher.after("PowercordCommands", AssetUtils, "getApplicationIconURL", (_, [props]) => {
        if (props.id === section.id) {
            return section.icon;
        }
    });

    Patcher.after("PowercordCommands", Commands, "queryCommands", (_, [{ query }], res) => {
        const cmds = [...commands.values()].filter(e => e.name.includes(query));

        res.push(...cmds);
    })

    Patcher.after("PowercordCommands", Commands, "getApplicationCommandSectionName", (_, [section], res) => {
        if (section.id === section.id) return section.name;
    });

    Patcher.after("PowercordCommands", CommandUtils, "useApplicationCommandsDiscoveryState", (_, [,,, isChat], res: any) => {
        if (isChat !== false) return res;

        if (!res.discoverySections.find(d => d.key == section.id) && commands.size) {
            const cmds = [...commands.values()];

            res.discoveryCommands.push(...cmds);
            res.commands.push(...cmds.filter(cmd => !res.commands.some(e => e.name === cmd.name)));

            res.discoverySections.push({
                data: cmds,
                key: section.id,
                section
            });

            res.sectionsOffset.push(commands.size);
        }

        if (!res.applicationCommandSections.find(s => s.id == section.id) && commands.size) {
            res.applicationCommandSections.push(section);
        }

        const index = res.discoverySections.findIndex(e => e.key === "-2");
        if (res.discoverySections[index]?.data) {
            const section = res.discoverySections[index];
            section.data = section.data.filter(c => !c.__powercord);

            if (section.data.length == 0) res.discoverySections.splice(index, 1);
        }
    });

    Events.addEventListener("reload-core", () => {
        Patcher.unpatchAll("PowercordCommands");
    });
};

export async function handleCommand(options, args) {
    const {command, executor} = options;

    try {
        const channel = DiscordModules.SelectedChannelStore.getChannelId();

        const res = await executor(args);

        if (!res || !res.result) return;

        if (!res.send) {
            const options: {
                content?: string
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
            })
        };
    } catch (error) {
        Logger.error(`Could not executor for ${options.command}-${command}:`, error);

        Clyde.sendMessage(void 0, {
            content: ":x: An error occurred while running this command. Check your console."
        });
    }
}


export function registerCommand(options: any) {
    const {command, executor, ...cmd} = options;

    commands.set(command, {
        type: 3,
        target: 1,
        id: command,
        name: command,
        applicationId: section.id,
        options: [
            {
                type: 3,
                required: false,
                description: `Usage: ${cmd.usage?.replace?.(/{c}/g, command) ?? command}`,
                name: "args"
            }
        ],
        ...cmd,
        __powercord: true,
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
