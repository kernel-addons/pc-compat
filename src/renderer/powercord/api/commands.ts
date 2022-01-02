import {matchAll} from "@modules/utilities";
import Webpack from "@modules/webpack";
import LoggerModule from "@modules/logger";
import Patcher from "@modules/patcher";
import {findInReactTree} from "@powercord/util";
import createStore from "@flux/zustand";
import CommandBar from "@ui/commandbar";
import Clyde from "@modules/clyde";
import DiscordModules from "@modules/discord";

const Logger = LoggerModule.create("Commands");
const [useCommandsStore, CommandsApi] = createStore({header: "", active: false, commands: []});

export const commands = new Map();
export const optionsRegex = /"(.+?)"/g;

export const section = {
    id: "powercord",
    type: 1,
    name: "Powercord",
    icon: "__POWERCORD__"
};

export function resetRow() {
    CommandsApi.setState({active: false, commands: [], header: ""});
}

export function initialize() {
    const [AssetUtils, CommandUtils, { AUTOCOMPLETE_OPTIONS }] = Webpack.findByProps(["getApplicationIconURL"], ["useApplicationCommandsDiscoveryState"], ["AUTOCOMPLETE_OPTIONS"], {bulk: true});

    Patcher.after("PowercordCommands", AssetUtils, "getApplicationIconURL", (_, [props]) => {
        if (props.icon === "__POWERCORD__") return "https://cdn.discordapp.com/attachments/891039688352219198/908403940738093106/46755359.png";
    });

    Patcher.after("PowercordCommands", CommandUtils, "useApplicationCommandsDiscoveryState", (_, [,,, isContextMenu], returnValue: any) => {
        if (isContextMenu !== false) return;

        const cmds = [...commands.values()];

        if (!returnValue.discoverySections.find(d => d.key == section.id)) {
            returnValue.applicationCommandSections.push(section);
            returnValue.discoveryCommands.push(...cmds);
            returnValue.commands.push(...cmds.filter(cmd => !returnValue.commands.some(e => e.name === cmd.name)));

            returnValue.discoverySections.push({
                data: cmds,
                key: section.id,
                section
            });

            returnValue.sectionsOffset.push(commands.size);
        }
    });

    Patcher.after("PowercordCommands", AUTOCOMPLETE_OPTIONS.COMMANDS, 'queryResults', (_this, [,, query], res) => {
        if (query == "") return res;

        const matches = [...commands.keys()].filter(c => c.toLowerCase().startsWith(query.toLowerCase()));

        return {
            results: {
                commands: [
                    ...res.results.commands,
                    ...matches.map(c => commands.get(c))
                ].filter(Boolean)
            }
        }
    })
};

export async function handleCommand(options, args) {
    const {command, executor} = options;

    try {
        const channel = DiscordModules.SelectedChannelStore.getChannelId();

        const res = await executor(args);

        if (!res || !res.result) return;

        if (!res.send) {
            const message = DiscordModules.MessageCreators.createBotMessage(channel);

            message.author.username = res.username || "Powercord";
            message.author.avatar = "__POWERCORD__";

            if (typeof res.result === "string") {
                message.content = res.result;
            } else {
                message.embeds.push(res.result);
            }

            DiscordModules.MessageActions.receiveMessage(message.channel_id, message)
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


export function registerCommand(options: any, result) {
    const {command, executor, ...cmd} = options;

    // if (cmd.autocomplete) return Logger.warn("Commands", "Custom autocomplete is not supported yet!");

    const cmdOptions: any[] = matchAll(optionsRegex, cmd.usage).map(([name]) => ({
        type: 3,
        name: name.slice(1, -1)
    }));

    cmdOptions.push({
        type: 3,
        required: false,
        name: "args"
    });

    commands.set(command, {
        type: 3,
        target: 1,
        id: command,
        name: command,
        __powercord: true,
        execute: async (result: any) => {
            try {
                const args = Object.values(result).map(e => e[0].text) ?? [];

                if (typeof (cmd.autocomplete) === "function") {
                    const cmds = cmd.autocomplete(args);
                    if (!cmds?.commands?.length) return;

                    CommandsApi.setState({
                        active: true,
                        commands: cmds.commands.map(({command}) => ({
                            name: command,
                            action: () => {
                                resetRow();
                                handleCommand(options, args);
                            }
                        })),
                        header: cmds.header ?? "result:"
                    });
                } else {
                    handleCommand(options, args);
                }
            } catch (error) {
                Logger.error(error);
            }
        },
        applicationId: section.id,
        options: cmdOptions,
        ...cmd,
    });
};

export function unregisterCommand(id: string) {
    commands.delete(id);
}

Webpack.whenReady.then(() => {
    const ChannelChatMemo = Webpack.findModule(m => m?.type?.toString().indexOf("useAndTrackNonFriendDMAccept") > -1);

    if (!ChannelChatMemo) return void Logger.warn("Commands", "ChannelChat memo component not found!");

    const unpatch = Patcher.after("Commands", ChannelChatMemo, "type", (_, __, returnValue: any) => {
        unpatch();

        const ChannelChat = returnValue.type;
        if (!ChannelChat) return void Logger.error("Commands", "Could no extract ChannelChat nested command!");

        Patcher.after("Commands", ChannelChat.prototype, "render", (_, __, returnValue) => {
            const form = findInReactTree(returnValue, n => n?.type === "form")?.props?.children;
            if (!Array.isArray(form)) return returnValue;

            form?.unshift(
                React.createElement(CommandBar, {
                    store: useCommandsStore,
                    onClose: resetRow
                })
            );
        });
    });
});