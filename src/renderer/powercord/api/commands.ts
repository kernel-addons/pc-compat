import {Webpack} from "../../modules";
import Logger from "../../modules/logger";
import Patcher from "../../modules/patcher";

export const commands = new Map();

export const section = {
    id: "powercord",
    type: 1,
    name: "Powercord",
    icon: "__POWERCORD__"
};

export function initialize() {
    const [AssetUtils, CommandUtils] = Webpack.findByProps(["getApplicationIconURL"], ["useApplicationCommandsDiscoveryState"], {bulk: true});

    Patcher.after("PowercordCommands", AssetUtils, "getApplicationIconURL", (_, [props]) => {
        if (props.icon === "__POWERCORD__") return "https://cdn.discordapp.com/attachments/891039688352219198/908403940738093106/46755359.png";
    });

    Patcher.after("PowercordCommands", CommandUtils, "useApplicationCommandsDiscoveryState", (_, __, returnValue: any) => {
        returnValue.applicationCommandSections.unshift(section);
        returnValue.discoveryCommands.unshift(...commands.values());
        returnValue.commands.unshift(...[...commands.values()].filter(cmd => !returnValue.commands.some(e => e.name === cmd.name)));
        returnValue.discoverySections.unshift({
            data: [...commands.values()],
            key: section.id,
            section
        });
    });
};

export function registerCommand(options: any) {
    const {command, executor, ...cmd} = options;

    if (cmd.autocomplete) return Logger.warn("Commands", "Custom autocomplete is not supported yet!");

    commands.set(command, {
        type: 1,
        target: 1,
        id: command,
        name: command,
        execute: (result) => {
            try {
                executor(Object.values(result).map(e => e[0].text));
            } catch (error) {
                Logger.error("Commands", error);
            }
        },
        applicationId: section.id,
        options: cmd.usage?.match(/"(.+?)"/g)?.map(name => ({
            type: 3,
            name: name.slice(1, -1)
        })) ?? [],
        ...cmd,
    });
};

export function unregisterCommand(id: string) {
    commands.delete(id);
}