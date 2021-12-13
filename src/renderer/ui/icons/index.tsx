import FolderOpened from "./folder-open";
import Folder from "./folder";
import PaintBrush from "./paint-brush";
import Save from "./save";
import VerifiedShield from "./verified_shield";
import Sass from "./sass";
import Css from "./css";
import WarningShield from "./warning_shield";

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