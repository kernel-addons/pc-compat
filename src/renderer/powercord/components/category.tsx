import DiscordModules, {promise} from "@modules/discord";
import Components from "@modules/components";
import {joinClassNames} from "@modules/utilities";
import Divider from "./divider";
import {fromPromise} from "./asynccomponent";

export default fromPromise(promise.then(() => {
    const {Forms, Text} = DiscordModules;
    const Caret = Components.get("Caret");

    return function Category({children, opened, onChange, name, description}) {
        return (
            <div className={joinClassNames("pc-category", [opened, "pc-category-opened"])}>
                <div className="pc-category-header" onClick={onChange}>
                    <div className="pc-category-details">
                        <Forms.FormTitle
                            color={Text.Colors.HEADER_PRIMARY}
                            tag={Forms.FormTitle.Tags.H3}
                            size={Text.Sizes.SIZE_16}
                            className="pc-category-details-title"
                        >
                            {name}
                        </Forms.FormTitle>
                        <Forms.FormText
                            color={Text.Colors.HEADER_SECONDARY}
                            size={Text.Sizes.SIZE_14}
                            className="pc-category-details-description"
                        >
                            {description}
                        </Forms.FormText>
                    </div>
                    <Caret direction={opened ? Caret.Directions.DOWN : Caret.Directions.RIGHT} className="pc-category-caret" />
                    {/* {!opened && <div className="pc-category-description">{description}</div>} */}
                    {/* <div className="pc-category-stroke" /> */}

                </div>
                <div className={`pc-category-content ${opened ? 'pc-margin-top-20' : ''}`}>{opened && children}</div>
                {!opened && <Divider />}
            </div>
        );
    }
}))