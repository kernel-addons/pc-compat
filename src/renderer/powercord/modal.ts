import {Webpack} from "../modules";
import Modals from "../ui/modals";

export let ModalContext = null;

Webpack.whenReady.then(() => {
    ModalContext = React.createContext(null);
});

export function open(Component: any) {
    const {ModalsAPI} = Modals;
    
    return ModalsAPI.openModal((props) => {
        return React.createElement(ModalContext.Provider, {value: props},
            React.createElement(Component, props)
        );
    });
};

export function close() {
    const {ModalsAPI} = Modals;

    const lastModal = ModalsAPI.useModalsStore?.getState?.()?.default?.slice(-1)[0]?.key;
    if (!lastModal) return;

    ModalsAPI.closeModal(lastModal);
};

export function closeAll() {
    const {ModalsAPI} = Modals;
    
    ModalsAPI.closeAllModals();
}