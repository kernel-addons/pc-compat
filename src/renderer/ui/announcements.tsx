import {findInReactTree, getOwnerInstance, waitFor} from "@powercord/util";
import AnnouncementContainer from "./components/announcementcontainer";
import LoggerModule from "@modules/logger";
import {promise} from "@modules/discord";
import createStore from "@flux/zustand";
import Patcher from "@modules/patcher";
import Webpack from "@modules/webpack";

const Logger = LoggerModule.create("Announcements");
const [, AnnouncementsApi] = createStore({ elements: {} });

export {AnnouncementsApi as api};

promise.then(async () => {
    const {base} = Webpack.findByProps("base", "container") || { base: "not-found" };
    const instance = getOwnerInstance(await waitFor(`.${base.split(" ")[0]}`));

    Patcher.after("pc-compat-notices", instance?.props?.children, "type", (_, args, res) => {
        try {
            const { children } = findInReactTree(res, r => r.className === base);
            children.unshift(<AnnouncementContainer />);
        } catch (err) {
            return Logger.error(err);
        }
    });

    instance.forceUpdate();
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
            [id]: { ...options, id }
        }
    });
}

export function closeAnnouncement(id: string) {
    const state = AnnouncementsApi.getState();
    if (!state.elements[id]) return false;

    delete state.elements[id];

    AnnouncementsApi.setState(Object.assign({}, state));
}