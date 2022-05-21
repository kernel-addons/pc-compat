import {omit} from "../../modules/utilities";
import Webpack from "../../modules/webpack";

const Modal: any = {};

Webpack.whenReady.then(() => {
    const ModalComponents = Webpack.findByProps("ModalRoot");
    const keys = omit(Object.keys(ModalComponents), "default", "ModalRoot");
    const props = Object.fromEntries(
        keys.map(key => [key === "ModalSize" ? "Sizes" : key.slice("Modal".length), ModalComponents[key]])
    );

    const ModalRoot = (props) => {
        return React.createElement(ModalComponents.ModalRoot, {
            transitionState: 1,
            ...props
        });
    };

    Object.assign(Modal, props, {
        Confirm: Webpack.findByDisplayName("ConfirmModal"),
        Modal: Object.assign(ModalRoot, props)
    });
});

export default Modal;