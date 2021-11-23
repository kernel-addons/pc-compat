import {omit} from "../../modules/utilities";
import Webpack from "../../modules/webpack";
import * as ModalActions from "../modal";

const WebpackPromise = Webpack.wait();

const Modal = {};

WebpackPromise.then(() => {
    const ModalComponents = Webpack.findByProps("ModalRoot");
    const keys = omit(Object.keys(ModalComponents), "default", "ModalRoot");
    const props = Object.fromEntries(
        keys.map(key => [key === "ModalSize" ? "Sizes" : key.slice("Modal".length), ModalComponents[key]])
    );

    const BindProps = (ModalComponent) => (props) => {
        const modalProps = React.useContext(ModalActions.ModalContext);
            
        return React.createElement(ModalComponent, Object.assign({}, modalProps, props));
    };

    Object.assign(Modal,props,{
        Confirm: Object.assign(
            BindProps(Webpack.findByDisplayName("ConfirmModal")),
            {displayName: "PowercordModal"}
        ),
        Modal: Object.assign(
            BindProps(ModalComponents.ModalRoot),
            {displayName: "PowercordModal"},
            props
        )
    });
});

export default Modal;