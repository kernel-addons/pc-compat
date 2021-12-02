import FolderOpened from "./folder-open";
import Folder from "./folder";
import PaintBrush from "./paint-brush";
import Save from "./save";

export const Icons = {FolderOpened, Folder, PaintBrush, Save};

export default function Icon({name, ...props}: {name: keyof typeof Icons, size?: string | number}) {
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