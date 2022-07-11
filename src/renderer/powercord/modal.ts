import DiscordModules from "../modules/discord";
import Modal from "@powercord/components/modal";

export function open(Component: any) {
    return DiscordModules.ModalsApi.openModal((props) => {
        return React.createElement(Modal.Modal, { ...props, className: 'pc-modal-container' },
            React.createElement(Component, props)
        );
    });
};

export function close() {
    const lastModal = DiscordModules.ModalsApi.useModalsStore?.getState?.()?.default?.slice(-1)[0]?.key;
    if (!lastModal) return;

    DiscordModules.ModalsApi.closeModal(lastModal);
};

export function closeAll() {
    DiscordModules.ModalsApi.closeAllModals();
};