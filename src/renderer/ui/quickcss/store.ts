import createStore from "@modules/zustand";

const [usePanelStore, PanelAPI] = createStore({sidebarVisible: true, panel: "", selectedFile: null});

export {usePanelStore, PanelAPI};