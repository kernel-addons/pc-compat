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
    Lodash: {
        props: ["zipObjectDeep"]
    },
    // Components
    ModalComponents: {
        props: ["ModalRoot", "ModalHeader"]
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
        name: "Text"
    },
    Markdown: {
        name: "Markdown",
        props: ["rules"]
    },
    TextInput: {
        name: "TextInput"
    },
    Forms: {
        props: ["FormItem", "FormTitle"]
    },
    Flex: {
        name: "Flex"
    },
    // Classes
    Margins: {
        props: ["marginXLarge"]
    },
    FormClasses: {
        props: ["formText", "description"]
    }
}