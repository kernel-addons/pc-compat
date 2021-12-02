import Css from "@ui/icons/css";
import Sass from "@ui/icons/sass";

export default function FileIcon({ext, ...props}) {
    switch (ext) {
        case ".scss":
        case ".sass":
            return (
                <Sass {...props} />
            );
        case ".css":
            return (
                <Css {...props} />
            );
        
        default:
            return null;
    }
}