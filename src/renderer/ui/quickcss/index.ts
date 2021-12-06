import {Constants} from "@data";
import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import DOM from "@modules/dom";
import LoggerModule from "@modules/logger";
import SettingsRenderer from "@modules/settings";
import {fs, path} from "@node";
import {SASS} from "@powercord/compilers";
import QuickCSSPanel from "./components/panel";
import {closeFile, getConfig} from "./util";

const Logger = LoggerModule.create("QuickCSS");

export default class QuickCSS {
    static injectedFiles = {};

    static async initialize(): Promise<void> {
        const {Lodash} = DiscordModules;
        Lodash.bindAll(this, ["onDataUpdate"]);

        SettingsRenderer.registerPanel(QuickCSS.name, {
            label: "QuickCSS",
            render: () => DiscordModules.React.createElement(QuickCSSPanel, {}),
            order: 2
        });
        this.loadMonaco();

        DataStore.on("QUICK_CSS_UPDATE" as any, this.onDataUpdate);
        this.onDataUpdate();
    }

    static shouldCompile(file: string) {
        return path.extname(file) !== ".css";
    }

    static onDataUpdate() {
        const files = getConfig().states;

        for (const file in files) {
            if (this.injectedFiles[file] && !files[file]) this.injectedFiles[file].destroy();
            if (!files[file]) continue;

            if (!fs.existsSync(file)) {
                closeFile(file);
                continue;
            }

            const code = this.shouldCompile(file) ? SASS.compile(file) : fs.readFileSync(file, "utf8");
            const id = path.basename(file).split(".").join("-");

            DOM.injectCSS(id, code);

            this.injectedFiles[file] = {
                destroy() {
                    DOM.clearCSS(id);
                }
            };
        }
    }

    static async loadMonaco(): Promise<void> {
        // Based off https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/editor.js
        Object.defineProperty(window, "MonacoEnvironment", {
            value: {
                getWorkerUrl() {
                    const monacoLoader = `
                        self.MonacoEnvironment = {baseUrl: ${JSON.stringify(Constants.MONACO_BASEURL)}};
                    `;

                    return `data:text/javascript;charset=utf-8,${encodeURIComponent(monacoLoader)}`;
                }
            }
        });

        DOM.injectCSS(QuickCSS.name, `${Constants.MONACO_BASEURL}/vs/editor/editor.main.min.css`, {type: "URL", documentHead: true});

        const originalRequire: any = window.require;
        await DOM.injectJS("monaco-script", `${Constants.MONACO_BASEURL}/vs/loader.min.js`, {documentHead: true});
        const amdLoader: any = window.require;
        window.require = originalRequire;
        amdLoader.config({paths: {vs: `${Constants.MONACO_BASEURL}/vs`}});
        amdLoader(["vs/editor/editor.main"], () => {});
        Logger.log("Module loaded!");
    }

    static dispose(): void {
        DataStore.off("data-update", this.onDataUpdate);
    }
}