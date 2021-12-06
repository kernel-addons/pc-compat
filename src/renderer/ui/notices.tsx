import DOM from "@modules/dom";
import DiscordModules, {promise} from "@modules/discord";
import createStore from "@flux/zustand";
import ErrorBoundary from "@powercord/components/errorboundary";
import {joinClassNames} from "@modules/utilities";
import DiscordIcon from "./discordicon";
import createDispatcher from "@flux/dispatcher";

const [useNoticesStore, NoticesApi] = createStore({notices: {}});
const Dispatcher = createDispatcher();

export function Notice(props) {
    const {ReactSpring: {useSpring, animated}, Button, Markdown} = DiscordModules;
    const [closing, setClosing] = React.useState(false);
    const timeout = React.useMemo(() => props.timeout || 3e3, []);
    const spring = useSpring({
        from: {
            progress: 0
        },
        to: {
            progress: 100
        },
        config: (key: string) => {
            switch (key) {
                case "progress": return {duration: timeout};
                default: return {duration: 250};
            }
        }
    });

    const startClosing = () => {
        spring.progress.set(100);
    };

    Dispatcher.useComponentDispatch("SET_CLOSING", (event) => {
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
                <div className="pc-notice-header-name">{props.header ?? "Unknown"}</div>
                <Button
                    look={Button.Looks.BLANK}
                    size={Button.Sizes.NONE}
                    className="pc-notice-close"
                    onClick={startClosing}
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
                            onClick={button.onClick}
                            size={Button.Sizes.MIN}
                            key={"button-" + i}
                            className="pc-notice-button"
                        >
                            {button.text}
                        </Button>
                    ))}
                </div>
            )}
            <div className="pc-notice-progress">
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
            </div>
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
    }

    static show(options: any) {
        const state = NoticesApi.getState();

        if (state.notices[options.id]) throw new Error(`Notice with id ${options.id} already exists!`);

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

    static close(id: string) {
        const state = NoticesApi.getState();

        if (!state.notices[id]) throw new Error(`Notice with id ${id} already exists!`);

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