import Notices from "@ui/notices";

export function sendToast(id: string, options: any) {
    return Notices.show(Object.assign(options, {id}));
}

export function closeToast(id: string) {
    return Notices.close(id);
}