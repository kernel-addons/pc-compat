import createStore from "@flux/zustand";
import {promise} from "@modules/discord";
import LoggerModule from "@modules/logger";
import Patcher from "@modules/patcher";
import {joinClassNames} from "@modules/utilities";
import Webpack, {Filters} from "@modules/webpack";
import {findInReactTree, getOwnerInstance} from "@powercord/util";

const Logger = LoggerModule.create("Announcements");
const [useAnnouncements, AnnouncementsApi] = createStore({elements: {}});
let classNames = null, ClickableComponent = (props: any) => null;

export function Announcement(props: any) {
    const className = [
        classNames.notice,
        classNames.colors[props.color] ?? classNames.colors.blurple,
    ];

    const handleClick = function (func: Function) {
        closeAnnouncement(props.id);
        if (typeof (func) === "function") func();
    };

    return (
        <div className={joinClassNames("powercord-notice", ...className)} id={props.id}>
            {props.message}
            <ClickableComponent className={classNames.closeButton} onClick={handleClick.bind(null, props.onClose)} />
            {props.button && (
                <button className={classNames.button} onClick={handleClick.bind(null, props.button.onClick)}>
                    {props.button.text}
                </button>
            )}
        </div>
    );
};

promise.then(() => {
    let renderRoute = (props: any) => null;
    const [
        {Switch} = {} as any,
        AppView,
        Notices,
        AppClasses,
        NoticeClasses,
        Clickable
    ] = Webpack.bulk(
        Filters.byProps("Router", "Switch"),
        Filters.byDisplayName("AppView", false),
        Filters.byTypeString("PrimaryCTANoticeButton"),
        Filters.byProps("app", "layers"),
        Filters.byProps("colorStreamerMode"),
        Filters.byDisplayName("Clickable")
    );
    
    ClickableComponent = Clickable;
    classNames = {
        ...NoticeClasses,
        colors: {
            blurple: NoticeClasses.colorBrand,
            red: NoticeClasses.colorDanger,
            organge: NoticeClasses.colorDefault,
            blue: NoticeClasses.colorInfo,
            dark: NoticeClasses.colorDark,
            blurple_gradient: NoticeClasses.colorPremiumTier1,
            spotify: NoticeClasses.colorSpotify,
            purple: NoticeClasses.colorStreamerMode,
            green: NoticeClasses.colorSuccess
        }
    };
    
    function PatchedAnnouncements() {
        const elements = useAnnouncements(s => Object.entries(s.elements));

        return (
            <React.Fragment>
                <Notices />
                {elements.map(([id, options]) => <Announcement key={id} id={id} {...options} />)}
            </React.Fragment>
        );
    }

    function PatchedViews(props: any) {
        const returnValue = AppView(props);

        try {
            const notices = findInReactTree(returnValue, n => n?.type === Notices);
            if (!notices) return returnValue;

            notices.type = React.memo(PatchedAnnouncements);
        } catch (error) {
            Logger.log("Error in NoticesContainer patch:", error);
        }

        return returnValue;
    }

    function PatchedChat({__pc_original, ...props}): any {
        const returnValue = __pc_original(props);

        try {
            const layer = returnValue.props.children[0];
            if (!layer) return returnValue;
            const clonedChild = React.cloneElement<any>(layer.props.children);
            clonedChild.type = PatchedViews;
            layer.props.children = clonedChild;
        } catch (error) {
            Logger.error("Error in PatchedChat:", error);
        }

        return returnValue;
    } 

    function patchedRenderRoute(props: any) {
        const returnValue = renderRoute(props);
        if (!returnValue) return;

        try {
            const original = returnValue.type.type;
            if (typeof (original) !== "function") return returnValue;
            returnValue.type = React.memo(PatchedChat)
            returnValue.props.__pc_original = original;
        } catch (error) {
            Logger.error("Announcements")
        }

        return returnValue;
    }

    Patcher.after("Announcements", Switch.prototype, "render", (_this, _, ret) => {
        const childs = _this.props.children;
        if (!Array.isArray(childs) || !childs[1]?.some?.((c: any) => c?.key === "/app")) return;

        const original = ret.props.children;
        ret.props.children = (props: any) => {
            const returnValue = original(props);
            if (returnValue.props.render === patchedRenderRoute) return returnValue;

            try {
                renderRoute = returnValue.props.render;
                returnValue.props.render = patchedRenderRoute;
            } catch (error) {
                Logger.error("Failed to patch Router Switch:", error);
            }

            return returnValue;
        };
    });

    const [node] = document.getElementsByClassName(AppClasses.app);
    if (!node) return Logger.warn("DOM Element for app was not found!");

    const instance = getOwnerInstance(node, instance => instance?.constructor?.displayName === "ViewsWithMainInterface");
    if (instance) instance.forceUpdate();

    //TODO: Patch the notice store to make sidebar rounded.
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
            [id]: options
        }
    });
}

export function closeAnnouncement(id: string) {
    const state = AnnouncementsApi.getState();
    if (!state.elements[id]) return false;

    delete state.elements[id];

    AnnouncementsApi.setState(Object.assign({}, state));
} 