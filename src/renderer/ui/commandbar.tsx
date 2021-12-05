import DiscordModules from "@modules/discord";
import DiscordIcon from "./discordicon";

export default function CommandBar({store, onClose}) {
    const {header, commands, active} = store();
    const {Forms, Scrollers, Button} = DiscordModules;
    
    return active ? (
        <div className="pc-command-list">
            <Forms.FormTitle tag={Forms.FormTitle.Tags.H5} className="pc-commands-title">
                {header}
                <Button look={Button.Looks.BLANK} size={Button.Sizes.NONE} onClick={onClose} className="pc-commands-close">
                    <DiscordIcon name="Close" />
                </Button>
            </Forms.FormTitle>
            <Scrollers.ScrollerThin>
                {commands.map(cmd => (
                    <div className="pc-command-row" data-cmd={cmd.name} key={cmd.name} onClick={cmd.action}>{cmd.name}</div>
                ))}
            </Scrollers.ScrollerThin>
        </div>
    ) : null;
}