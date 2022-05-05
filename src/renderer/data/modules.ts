export default {
    // React, Modules & Constants
    Constants: {
        props: ["API_HOST", "ActionTypes"]
    },
    React: {
        props: ["createElement", "isValidElement"]
    },
    ReactDOM: {
        props: ["render", "createPortal"]
    },
    ReactSpring: {
        props: ["useSpring", "Controller", "animated"]
    },
    Flux: {
        type: "MERGE",
        props: [
            ["Store", "Dispatcher"],
            ["connectStores"]
        ]
    },
    Dispatcher: {
        props: ["dirtyDispatch"]
    },
    ContextMenuActions: {
        props: ["openContextMenu"]
    },
    ModalsApi: {
        props: ["openModal", "useModalsStore"]
    },
    ModalStack: {
        props: ["push", "popAll"]
    },
    LocaleManager: {
        props: ["Messages", "getAvailableLocales"],
        ensure: (mod: any) => mod.Messages.CLOSE
    },
    LocaleStore: {
        props: ["locale", "theme"]
    },
    Lodash: {
        props: ["zipObjectDeep"]
    },
    MessageCreators: {
        props: ["createBotMessage"]
    },
    MessageActions: {
        props: ["receiveMessage"]
    },
    AvatarDefaults: {
        props: ["BOT_AVATARS"]
    },
    Moment: {
        props: ["momentProperties"]
    },
    // Stores
    SelectedChannelStore: {
        props: ["_dispatchToken", "getChannelId", "getLastSelectedChannelId"]
    },
    // Components
    ModalComponents: {
        props: ["ModalRoot", "ModalHeader"]
    },
    Link: {
        name: "Anchor"
    },
    Switch: {
        name: "Switch"
    },
    SwitchItem: {
        name: "SwitchItem"
    },
    TextInput: {
        name: "TextInput"
    },
    TextArea: {
        name: "TextArea"
    },
    SelectInput: {
        name: "SelectTempWrapper"
    },
    Tooltips: {
        props: ["TooltipContainer"],
        rename: [
            {from: "default", to: "Tooltip"},
            {from: "TooltipContainer", to: "Container"},
            {from: "TooltipColors", to: "Colors"},
            {from: "TooltipPositions", to: "Positions"},
            {from: "TooltipLayer", to: "Layer"},
        ]
    },
    Button: {
        props: ["BorderColors", "Colors"]
    },
    Slider: {
        name: "Slider"
    },
    ConfirmationModal: {
        name: "ConfirmModal"
    },
    Text: {
        name: "LegacyText"
    },
    Markdown: {
        name: "Markdown",
        props: ["rules"]
    },
    Caret: {
        name: "Caret"
    },
    Forms: {
        props: ["FormItem", "FormTitle"]
    },
    Flex: {
        name: "Flex"
    },
    SearchBar: {
        name: "SearchBar"
    },
    Spinner: {
        name: "Spinner"
    },
    Scrollers: {
        props: ["ScrollerAuto", "ScrollerThin", "default"]
    },
    Popout: {
        name: "Popout"
    },
    // Classes
    Margins: {
        props: ["marginXLarge"]
    },
    FormClasses: {
        props: ["formText", "description"]
    },
    // ContextMenu
    ContextMenu: {
        type: "MERGE",
        props: [
            ["openContextMenu"],
            ["MenuItem", "MenuControlItem"]
        ],
        rename: [
            {from: "default", to: "Menu"},
            {from: "MenuItem", to: "Item"},
            {from: "MenuGroup", to: "Group"},
            {from: "MenuCheckboxItem", to: "CheckboxItem"},
            {from: "MenuSeparator", to: "Separator"},
            {from: "MenuCheckboxItem", to: "CheckboxItem"},
            {from: "MenuRadioItem", to: "RadioItem"},
            {from: "MenuStyle", to: "Style"},
            {from: "MenuControlItem", to: "ControlItem"},
            {from: "openContextMenu", to: "open"},
            {from: "closeContextMenu", to: "close"},
        ]
    },
    PlaceholderClasses: {
        props: ["emptyStateImage", "emptyStateSubtext"]
    }
}