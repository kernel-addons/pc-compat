import Components from "../../modules/components";
import {joinClassNames} from "../../modules/utilities";

export default function Category({children, opened, onChange, name, description}) {
    const Caret = Components.get("Caret");

    return (
        <div className={joinClassNames("pc-category", [opened, "pc-category-opened"])}>
            <div className="pc-category-header" onClick={onChange}>
                <div className="pc-category-label">{name}</div>
                <div className="pc-category-stroke" />
                <Caret direction={opened ? Caret.Directions.DOWN : Caret.Directions.LEFT} className="pc-category-caret" />
            </div>
            <div className="pc-category-content">{opened && children}</div>
            <div className="pc-category-description">{description}</div>
        </div>
    );
}