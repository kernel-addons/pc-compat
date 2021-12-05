import DiscordModules, {promise} from "./discord";

export const DefaultMessage = {
    state: "SENT",
    author: {
        avatar: "__POWERCORD__",
        id: "94762492923748352",
        bot: true,
        discriminator: "#0001",
        username: "powerCord"
    },
    content: "Message."
};

promise.then(() => {
    const {AvatarDefaults} = DiscordModules;

    if (!AvatarDefaults) return;

    AvatarDefaults.BOT_AVATARS["__POWERCORD__"] = "https://cdn.discordapp.com/avatars/518171798513254407/665fe74ee3fbf58b9d5949d7e15dbafa.webp";
});

export default class Clyde {
    static sendMessage(channelId: string = DiscordModules.SelectedChannelStore.getChannelId(), message) {
        const {MessageActions, MessageCreators, Lodash} = DiscordModules;

        MessageActions.receiveMessage(channelId, Lodash.merge({}, MessageCreators.createBotMessage(channelId, message?.content), DefaultMessage, message));
    }
}