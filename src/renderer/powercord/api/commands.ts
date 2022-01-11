import Webpack from "@modules/webpack";
import LoggerModule from "@modules/logger";
import Patcher from "@modules/patcher";
import Clyde from "@modules/clyde";
import DiscordModules from "@modules/discord";

const Logger = LoggerModule.create("Commands");

export const commands = new Map();

export const section = {
    id: "powercord",
    type: 1,
    name: "Powercord",
    icon: "__POWERCORD__"
};

export function initialize() {
    const [AssetUtils, CommandUtils, Commands] = Webpack.findByProps(["getApplicationIconURL"], ["useApplicationCommandsDiscoveryState"], ["getBuiltInCommands"], {bulk: true});

    Patcher.after("PowercordCommands", AssetUtils, "getApplicationIconURL", (_, [props]) => {
        if (props.icon === "__POWERCORD__") return "https://cdn.discordapp.com/attachments/891039688352219198/908403940738093106/46755359.png";
    });

    Patcher.after("PowercordCommands", Commands, "getBuiltInCommands", (_, [,, isChat], res) => {
        if (isChat !== false) return res;

        return [...res, ...commands.values()]
    })

    Patcher.after("PowercordCommands", CommandUtils, "useApplicationCommandsDiscoveryState", (_, [,,, isChat], res: any) => {
        if (isChat !== false) return res;


        if (!res.discoverySections.find(d => d.key == section.id)) {
            const cmds = [...commands.values()];

            res.applicationCommandSections.push(section);
            res.discoveryCommands.push(...cmds);
            res.commands.push(...cmds.filter(cmd => !res.commands.some(e => e.name === cmd.name)));

            res.discoverySections.push({
                data: cmds,
                key: section.id,
                section
            });

            res.sectionsOffset.push(commands.size);
        }

        const index = res.discoverySections.findIndex(e => e.key === "-2");
        if (res.discoverySections[index]?.data) {
            const section = res.discoverySections[index];
            section.data = section.data.filter(c => !c.__powercord);

            if (section.data.length == 0) res.discoverySections.splice(index, 1);
        }
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
            } = {};

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
                autocomplete: true,
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