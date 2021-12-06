import {matchAll} from "@modules/utilities";
import Webpack from "@modules/webpack";
import Logger from "@modules/logger";
import Patcher from "@modules/patcher";
import {findInReactTree} from "@powercord/util";
import createStore from "@flux/zustand";
import CommandBar from "@ui/commandbar";
import Clyde from "@modules/clyde";

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

    Patcher.after("PowercordCommands", CommandUtils, "useApplicationCommandsDiscoveryState", (_, __, returnValue: any) => {
        const cmds = [...commands.values()];

        if (!returnValue.discoverySections.find(d => d.key == section.id)) {
            returnValue.applicationCommandSections.unshift(section);
            returnValue.discoveryCommands.unshift(...cmds);
            returnValue.commands.unshift(...cmds.filter(cmd => !returnValue.commands.some(e => e.name === cmd.name)));

            returnValue.discoverySections.unshift({
                data: cmds,
                key: section.id,
                section
            });

            returnValue.sectionsOffset.unshift(commands.size);
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

export function registerCommand(options: any) {
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
        execute: (result: any) => {
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
                                try {
                                    const res = executor([command]);

                                    if (res?.result) {
                                        Clyde.sendMessage(void 0, {content: res.result});
                                    }
                                } catch (error) {
                                    Logger.error("Commands", `Could not executor for ${options.command}-${command}:`, error);

                                    Clyde.sendMessage(void 0, {
                                        content: ":x: An error occurred while running this command. Check your console."
                                    });
                                }
                            }
                        })),
                        header: cmds.header ?? "result:"
                    });
                } else {
                    executor(args);
                }
            } catch (error) {
                Logger.error("Commands", error);
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