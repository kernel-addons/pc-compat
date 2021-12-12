import createStore from "@flux/zustand";
import Announcement from "./announcement";

const useAnnouncements = createStore({elements: {}});

export const AnnouncementsStore = useAnnouncements;

export default function AnnouncementContainer({store: useAnnouncements}) {
    const elements = useAnnouncements(state => state.elements);

    return (
        <React.Fragment>
            {Object.values<any>(elements).map((notice) => (
                <Announcement {...notice} key={notice.id} />
            ))}
        </React.Fragment> 
    );
};