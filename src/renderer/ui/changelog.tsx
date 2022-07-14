import {fromPromise} from "@powercord/components/asynccomponent";
import DiscordModules, {promise} from "@modules/discord";
import {joinClassNames} from "@modules/utilities";
import Webpack, {Filters} from "@modules/webpack";
import DiscordIcon from "./discordicon";

export type ChangeLogItem = {
    title: string;
    items: string[];
    type: "FIXED" | "IMPROVED" | "ADDED" | "PROGRESS";
};

export type ChangeLogItems = ChangeLogItem[];

export default fromPromise(promise.then(() => {
    const {
        Heading: {Heading}, Moment, Text, Markdown, Flex,
        ModalComponents: {ModalRoot, ModalHeader, ModalContent, ModalCloseButton, ModalFooter}
    } = DiscordModules;

    const [
        changelogClasses,
        modalClasses,
        Invites
    ] = Webpack.bulk(
        Filters.byProps("progress", "improved", "container"),
        Filters.byProps("content", "maxModalWidth", "modal"),
        Filters.byProps("acceptInviteAndTransitionToInviteChannel")
    );

    const ItemTypes = {
        IMPROVED: changelogClasses?.improved,
        ADDED: changelogClasses?.added,
        FIXED: changelogClasses?.fixed,
        PROGRESS: changelogClasses?.progress
    };

    const buildChangelogItem = function (item: ChangeLogItem, index: number) {
        return (
            <React.Fragment key={item.title}>
                <h1 className={joinClassNames(changelogClasses?.title, ItemTypes[item.type] ?? ItemTypes.ADDED, [index === 0, "pc-margin-top-0"])}>
                    {item.title}
                </h1>
                <ul>
                    {item.items.map(item => (
                        <li key={item}>
                            <Markdown>
                                {item}
                            </Markdown>
                        </li>
                    ))}
                </ul>
            </React.Fragment>
        );
    };

    return function ChangeLog({items, title, image, date, ...props}: {items: ChangeLogItems, date: number, image: string, title: string, onClose: Function;}) {
        return (
            <ModalRoot {...props} className={modalClasses?.content}>
                <ModalHeader separator={false}>
                    <Flex.Child basis="auto" grow={1} shrink={1} wrap={false}>
                        <Heading variant='heading-lg/medium'>
                            {title}
                        </Heading>
                        {date && <Text
                            size={Text.Sizes.SMALL}
                            color={Text.Colors.HEADER_SECONDARY}
                        >
                            {Moment(date).format('DD MMMM Y')}
                        </Text>}
                    </Flex.Child>
                    <Flex.Child basis="auto" rgrow={0} shrink={1} wrap={false}>
                        <ModalCloseButton onClick={props.onClose} />
                    </Flex.Child>
                </ModalHeader>
                <ModalContent>
                    {image && <img
                        className={changelogClasses?.image}
                        style={{objectFit: 'cover', marginBottom: 15}}
                        src={image}
                        width='1920'
                        height='254'
                    />}
                    {items.map(buildChangelogItem)}
                    <div
                        aria-hidden='true'
                        style={{
                            position: 'absolute',
                            pointerEvents: 'none',
                            minHeight: 0,
                            minWidth: 1,
                            flex: '0 0 auto',
                            height: 20
                        }}
                    />
                </ModalContent>
                <ModalFooter direction={false}>
                    <div className={joinClassNames(changelogClasses?.footer, "pc-changelog-modal-footer")}>
                        <div
                            style={{cursor: "pointer"}}
                            onClick={() => {
                                Invites.acceptInviteAndTransitionToInviteChannel("8mPTjTZ4SZ");
                                props.onClose();
                            }}
                            className={joinClassNames("pc-changelog-social-link", changelogClasses?.socialLink)}
                        >
                            <DiscordIcon
                                width={18}
                                height={18}
                                name="Discord"
                            />
                        </div>
                        <Text
                            size={Text.Sizes.SIZE_12}
                        >
                            Join the server for more updates!
                        </Text>
                    </div>
                </ModalFooter>
            </ModalRoot>
        );
    };
}));