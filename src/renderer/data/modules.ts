export default {
    React: {
        type: "DEFAULT",
        props: ["createElement", "isValidElement"]
    },
    ReactDOM: {
        type: "DEFAULT",
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
        type: "DEFAULT",
        props: ["dirtyDispatch"]
    },
    TextInput: {
        type: "DEFAULT",
        name: "TextInput"
    },
    Forms: {
        type: "DEFAULT",
        props: ["FormItem", "FormTitle"]
    },
    ContextMenuActions: {
        type: "DEFAULT",
        props: ["openContextMenu"]
    },
    ModalsApi: {
        type: "DEFAULT",
        props: ["openModal", "useModalsStore"]
    },
    ModalStack: {
        type: "DEFAULT",
        props: ["push", "popAll"]
    },
    ModalComponents: {
        type: "DEFAULT",
        props: ["ModalRoot", "ModalHeader"]
    },
    Button: {
        type: "DEFAULT",
        props: ["DropdownSizes"]
    },
    Slider: {
        type: "DEFAULT",
        name: "Slider"
    },
    ConfirmationModal: {
        type: "DEFAULT",
        name: "ConfirmModal"
    },
    Text: {
        type: "DEFAULT",
        name: "Text"
    },
    Markdown: {
        type: "DEFAULT",
        name: "Markdown",
        props: ["rules"]
    },
    LocaleManager: {
        type: "DEFAULT",
        props: ["Messages", "getAvailableLocales"],
        ensure: (mod: any) => mod.Messages.CLOSE
    },
    Constants: {
        type: "DEFAULT",
        props: ["API_HOST", "ActionTypes"]
    }
}