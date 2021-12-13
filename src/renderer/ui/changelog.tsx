import DiscordModules, {promise} from "@modules/discord";
import {joinClassNames} from "@modules/utilities";
import Webpack, {Filters} from "@modules/webpack";
import {fromPromise} from "@powercord/components/asynccomponent";

export type ChangeLogItem = {
    title: string;
    items: string[];
    type: "FIXED" | "IMPROVED" | "ADDED" | "PROGRESS";
};

export type ChangeLogItems = ChangeLogItem[];

export default fromPromise(promise.then(() => {
    const {
        Markdown, Flex,
        Forms: {FormTitle},
        ModalComponents: {ModalRoot, ModalHeader, ModalContent, ModalCloseButton}
    } = DiscordModules;
    const [
        changelogClasses,
        modalClasses,
    ] = Webpack.bulk(
        Filters.byProps("progress", "improved", "container"),
        m => m.content && m.modal && Object.keys(m).length === 2
    );

    const ItemTypes = {
        IMPROVED: changelogClasses.improved,
        ADDED: changelogClasses.added,
        FIXED: changelogClasses.fixed,
        PROGRESS: changelogClasses.progress
    };

    const buildChangelogItem = function (item: ChangeLogItem, index: number) {
        return (
            <React.Fragment key={item.title}>
                <h1 className={joinClassNames(changelogClasses.title, ItemTypes[item.type] ?? ItemTypes.ADDED, [index === 0, "pc-margin-top-0"])}>
                    {item.title}
                </h1>
                <ul>
                    {item.items.map(item => (
                        <li key={item}>
                            <Markdown>{item}</Markdown>
                        </li>
                    ))}
                </ul>
            </React.Fragment>
        );
    };

    return function ChangeLog({items, title, ...props}: {items: ChangeLogItems, title: string, onClose: Function}) {
        return (
            <ModalRoot {...props} className={joinClassNames(changelogClasses.container, modalClasses.content)}>
                <ModalHeader separator={false}>
                    <Flex.Child basis="auto" grow={1} shrink={1} wrap={false}>
                        <FormTitle tag={FormTitle.Tags.H2}>{title}</FormTitle>
                    </Flex.Child>
                    <Flex.Child basis="auto" rgrow={0} shrink={1} wrap={false}>
                        <ModalCloseButton onClick={props.onClose} />
                    </Flex.Child>
                </ModalHeader>
                <ModalContent>
                    {items.map(buildChangelogItem)}
                </ModalContent>
            </ModalRoot>
        );
    }
}));