import Announcement from "./announcement";
import {api} from "../announcements";

export default function AnnouncementContainer(props): JSX.Element | null {
    const [, forceUpdate] = React.useReducer(e => e + 1, 0);
    const _handler = () => forceUpdate();

    React.useEffect(() => {
        api.addListener(_handler);

        return () => {
            api.removeListener(_handler);
        };
    }, []);

    const elements = api.getState?.()?.elements;

    return elements ? <>
        {Object.values(elements).map((notice, index) => <Announcement {...notice} className="pc-announcement" />)}
    </> : null;
};