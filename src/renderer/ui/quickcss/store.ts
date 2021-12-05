import createStore from "@flux/zustand";

const [usePanelStore, PanelAPI] = createStore({sidebarVisible: true, panel: "", selectedFile: null});

export {usePanelStore, PanelAPI};