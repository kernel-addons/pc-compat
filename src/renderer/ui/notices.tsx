import DOM from "@modules/dom";
import DiscordModules, {promise} from "@modules/discord";
import createStore from "@flux/zustand";
import ErrorBoundary from "@powercord/components/errorboundary";
import {joinClassNames, uuid} from "@modules/utilities";
import DiscordIcon from "./discordicon";
import createDispatcher from "@flux/dispatcher";
import {FontAwesome} from "@powercord/components/icons";
import Events from "@modules/events";

const [useNoticesStore, NoticesApi] = createStore({notices: {}});
const Dispatcher = createDispatcher();

const types = {
    info: {
        icon: 'info-circle',
        color: 'var(--info-help-foreground)'
    },
    warning: {
        icon: 'exclamation-circle',
        color: 'var(--info-warning-foreground)'
    },
    danger: {
        icon: 'times-circle',
        color: 'var(--info-danger-foreground)'
    },
    success: {
        icon: 'check-circle',
        color: 'var(--info-positive-foreground)'
    }
};

export function Notice(props) {
    const {ReactSpring: {useSpring, animated}, Button, Markdown} = DiscordModules;
    const [closing, setClosing] = React.useState(false);

    if (props.type && types[props.type]) props.icon = {...types[props.type]};

    const spring = useSpring({
        from: {
            progress: 0
        },
        to: {
            progress: 100
        },
        config: (key: string) => {
            switch (key) {
                case "progress": return {duration: props.timeout};
                default: return {duration: 0};
            }
        }
    });

    const startClosing = () => {
        spring.progress.set(100);
    };

    Dispatcher.useComponentDispatch("SET_CLOSING", (event) => {
        if (event.all) setClosing(true);
        if (event.id !== props.id) return;

        startClosing();
    });

    React.useEffect(() => {
        if (!closing) return;

        setTimeout(props.onClose, 380);
    }, [closing]);

    return (
        <animated.div
            onMouseEnter={() => spring.progress.pause()}
            onMouseLeave={() => spring.progress.resume()}
            className={joinClassNames("pc-notice-container", [closing, "pc-notice-closing"])}
        >
            <div className="pc-notice-header">
                <div className="pc-notice-header-name">
                    {props.icon && typeof props.icon == 'object' ?
                        <FontAwesome
                            className="pc-notice-icon"
                            spin={props.icon.spin}
                            icon={props.icon.icon}
                            color={props.icon.color}
                        /> :
                        <FontAwesome className="pc-notice-icon" icon={props.icon} />
                    }
                    {props.header}
                </div>
                <Button
                    look={Button.Looks.BLANK}
                    size={Button.Sizes.NONE}
                    className="pc-notice-close"
                    onClick={() => setClosing(true)}
                    onContextMenu={() => Dispatcher.emit({type: "SET_CLOSING", all: true})}
                >
                    <DiscordIcon name="Close" />
                </Button>
            </div>
            {props.content && <div className="pc-notice-content">
                {typeof(props.content) === "string" ? <Markdown>{props.content}</Markdown> : props.content}
            </div>}
            {Array.isArray(props.buttons) && (
                <div className="pc-notice-footer">
                    {props.buttons.map((button, i) => button && (
                        <Button
                            color={Button.Colors[button.color?.toUpperCase() ?? "BRAND_NEW"]}
                            look={Button.Looks[button.look?.toUpperCase() || "FILLED"]}
                            size={Button.Sizes[button.size?.toUpperCase() || "MIN"]}
                            onClick={() => {
                                button.onClick?.()
                                setClosing(true);
                            }}
                            key={"button-" + i}
                            className="pc-notice-button"
                        >
                            {button.text}
                        </Button>
                    ))}
                </div>
            )}
            {props.timeout > 0 && <div className="pc-notice-progress">
                <animated.div
                    className="pc-notice-progress-bar"
                    style={{
                        width: spring.progress.to(e => {
                            if (e > 97 && props.timeout !== 0 && !closing) {
                                setClosing(true);
                            }

                            return `${e}%`;
                        })
                    }}
                >

                </animated.div>
            </div>}
        </animated.div>
    );
};

export function NoticesContainer() {
    const notices = useNoticesStore(s => Object.entries(s.notices));
    return (
        <ErrorBoundary>
            {notices.map(([id, notice]) => (
                <Notice id={id} {...notice} key={id} />
            ))}
        </ErrorBoundary>
    );
}

export default class Notices {
    static container = DOM.createElement("div", {className: "pc-notices"});

    static initialize() {
        const {ReactDOM} = DiscordModules;

        ReactDOM.render(<NoticesContainer />, this.container);

        document.body.appendChild(this.container);

        Events.addEventListener("reload-core", () => {
            ReactDOM.unmountComponentAtNode(this.container);
            this.container.remove();
        });
    }

    static show(options: any) {
        const state = NoticesApi.getState();

        if (!options.id || state.notices[options.id]) options.id = uuid();

        NoticesApi.setState({
            notices: {
                ...state.notices,
                [options.id]: {
                    ...options,
                    onClose: () => {
                        this.remove(options.id);
                    }
                }
            }
        });
    }

    static isShown(id: string): boolean {
        return !!NoticesApi.getState().notices[id];
    }

    static close(id: string) {
        const state = NoticesApi.getState();

        if (!state.notices[id]) throw new Error(`Notice with id ${id} does not exist!`);

        Dispatcher.emit({type: "SET_CLOSING", id: id});
    }

    static remove(id: string) {
        const state = NoticesApi.getState();

        if (!state.notices[id]) throw new Error(`Notice with id ${id} already exists!`);
        delete state.notices[id];

        NoticesApi.setState({
            notices: {...state.notices}
        });
    }
}
promise.then(() => Notices.initialize());