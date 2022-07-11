import {fromPromise} from "@powercord/components/asynccomponent";
import {forceUpdateElement} from "@powercord/util";
import LoggerModule from "./logger";
import {promise} from "./discord";
import Patcher from "./patcher";
import Webpack from "./webpack"
import Events from "./events";

const Logger = new LoggerModule("ComponentPatcher");

const patchAvatars = function () {
    const Avatar = Webpack.findByProps("AnimatedAvatar");
    if (!Avatar) return;
    Patcher.after("pc-utility-classes-avatar", Avatar, "default", (_, args, res) => {
        if (args[0]?.src?.includes("/avatars")) {
            res.props["data-user-id"] = args[0].src.match(/\/(?:avatars|users)\/(\d+)/)?.[1];
        }

        return res;
    });

    Patcher.after("pc-utility-classes-animated-avatar", Avatar.AnimatedAvatar, "type", (_, args, res) => {
        return <Avatar.default {...res.props} />;
    })

    const AvatarWrapper = Webpack.findByProps("wrapper", "avatar")?.wrapper?.split(" ")?.[0];
    if (!AvatarWrapper) return;
    setImmediate(() => forceUpdateElement(`.${AvatarWrapper}`));
};

const injectMessageName = function () {
    const Message = Webpack.findModule(m => m?.toString()?.indexOf("childrenSystemMessage") > -1);
    if (!Message) return Logger.warn("Message Component was not found!");

    Message.displayName = "Message";
};

const injectAsyncFlux = function () {
    const Flux = Webpack.findByProps("connectStores");
    if (!Flux) return;

    Flux.connectStoresAsync = function (stores: Promise<any>[], factory: Function) {
        return (Component: any) => fromPromise(Promise.all(stores).then((stores) => {
            return Flux.connectStores(stores, (props: any) => factory(stores, props))(Component);
        }));
    };
}

export default promise.then(() => {
    patchAvatars();
    injectMessageName();
    injectAsyncFlux();

    Events.addEventListener("reload-core", () => {
        Patcher.unpatchAll("pc-utility-classes-animated-avatar");
        Patcher.unpatchAll("pc-utility-classes-avatar");
    });
});