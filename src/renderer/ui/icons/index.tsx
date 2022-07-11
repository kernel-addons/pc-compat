import VerifiedShield from "./verified_shield";
import WarningShield from "./warning_shield";
import FolderOpened from "./folder-open";
import PaintBrush from "./paint-brush";
import Folder from "./folder";
import Save from "./save";
import Sass from "./sass";
import Css from "./css";

export const Icons = {FolderOpened, Folder, PaintBrush, Save, VerifiedShield, Sass, Css, WarningShield};

export default function Icon({name, ...props}: {name: keyof typeof Icons, size?: string | number, className?: string}) {
    const IconComponent = Icons[name];
    let extraProps: any = {};

    if (!IconComponent) return null;
    if (props.size) {
        extraProps.width = extraProps.height = props.size;
    }

    return (
        <IconComponent {...props} {...extraProps} />
    );
}