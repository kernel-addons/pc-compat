import AnnouncementContainer, {AnnouncementsStore} from "./components/announcementcontainer";
import {findInReactTree, getOwnerInstance, waitFor} from "@powercord/util";
import LoggerModule from "@modules/logger";
import {promise} from "@modules/discord";
import Patcher from "@modules/patcher";
import Webpack from "@modules/webpack";
import Events from "@modules/events";

const Logger = LoggerModule.create("Announcements");

const [useAnnouncementsStore, AnnouncementsApi] = AnnouncementsStore;

const patchClassNames = function () {
    const noticeClasses = Webpack.findByProps("notice", "colorDefault", "buttonMinor");
    if (!noticeClasses?.notice) return;

    if (noticeClasses.notice.indexOf("powercord-announcement")) return;
    noticeClasses.notice += " powercord-announcement";
};

const patchNoticeContainer = async function () {
    const {base} = Webpack.findByProps("base", "container") ?? {base: "pc-not-found"};
    const instance = getOwnerInstance(await waitFor(`.${base.split(" ")[0]}`));

    Patcher.after("pc-compat-notices", instance?.props?.children, "type", (_, args, res) => {
        try {
            const {children} = findInReactTree(res, r => r.className === base);
            children.unshift(<AnnouncementContainer store={useAnnouncementsStore} />);
        } catch (error) {
            return Logger.error(error);
        }
    });

    instance.forceUpdate();
};

promise.then(() => {
    patchClassNames();
    patchNoticeContainer();

    Events.addEventListener("reload-core", () => {
        Patcher.unpatchAll("pc-compat-notices");
    });
}).catch(error => {
    Logger.error("Failed to initialize:", error);
});

export function sendAnnouncement(id: string, options: any) {
    const state = AnnouncementsApi.getState();
    if (state.elements[id]) throw `Announcement with id ${id} already exists!`;

    AnnouncementsApi.setState({
        ...state,
        elements: {
            ...state.elements,
            [id]: {...options, id}
        }
    });
}

export function closeAnnouncement(id: string) {
    const state = AnnouncementsApi.getState();
    if (!state.elements[id]) return false;

    delete state.elements[id];

    AnnouncementsApi.setState(Object.assign({}, state));
}