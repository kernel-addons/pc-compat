import DiscordModules, {promise} from "../modules/discord";

export let ModalContext = null;

promise.then(() => {
    ModalContext = DiscordModules.React.createContext(null);
});

export function open(Component: any) {
    return DiscordModules.ModalsApi.openModal((props) => {
        return React.createElement(ModalContext.Provider, {value: props},
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