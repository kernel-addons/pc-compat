import { joinClassNames } from "@modules/utilities";

const styles = ["regular", "light", "duotone", "brands"];
const stylePrefixes = ["far", "fal", "fad", "fab"];

export default (props) => {
    const style = styles.find(style => style === props.icon.split(" ")[0].match(/[a-z]+(?!.*-)/)[0]);
    const stylePrefix = stylePrefixes[styles.indexOf(style)] ?? "fas";
    const iconName = props.icon.replace(`-${style}`, "");

    return <span className={joinClassNames(stylePrefix, `fa-${iconName}`, props.className ?? "").trim()} />
};