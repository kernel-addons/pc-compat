import Events from "./events";
import LoggerModule from "./logger";
import {testJSON} from "./utilities";

const Logger = new LoggerModule("DevServer");

const DevServer = new class DevServer {
    _ws: WebSocket = null;

    close(): void {
        if (!this._ws) return;

        Logger.log("DevServer", "Closing WebSocket");
        this._ws = null;
    }

    initialize(): void {
        const win = window as any;
        
        if (win.PCDevServer && win.PCDevServer.ws != null) {
            Logger.log("Taking over socket");
            this._ws = win.PCDevServer.ws;
        } else {
            Logger.log("Loading development server...");
            this._ws = new WebSocket("ws://localhost:5858");
        }

        win.PCDevServer = DevServer;
        this._ws.onmessage = this.handleMessage;
        this._ws.onerror = (error) => {
            Logger.error("DevServer", "Fatal error:", error);
        }
        this._ws.onclose = () => {
            this._ws = null;
            Logger.error("Connection closed...");
        };
    }

    handleMessage = ({data}): void => {
        const message = testJSON<any>(data);
        if (!message) return Logger.error("Unable to parse message:", data);

        switch (message.operation) {
            case "HELLO": {
                this.send("HELLO", {
                    client: `Discord->${(window as any).DiscordNative.app.getReleaseChannel()}`
                });

                Logger.log("WS Connected");
            } break;

            case "RELOAD_STYLES": {
                this.reloadStyles();
            } break;

            case "RELOAD_CORE": {
                this.reloadCore();
            } break;

            default: {
                Logger.log("Unknown operation:", message.operation);
            };
        }
    }

    send(operation: "HELLO" | "CLOSE", data: any): void {
        if (!this._ws) throw "Tried sending message without connection established";

        this._ws.send(JSON.stringify({
            operation: operation,
            data: data
        }));
    }

    reloadCore(): void {
        const path = window.require("path");
        const fs = window.require("fs");

        Logger.log("Reloading core...");

        Events.dispatchEvent(new Event("reload-core"));

        const content = fs.readFileSync(path.join(PCCompatNative.getBasePath(), "dist", "renderer.js"), "utf8" as any);
        const script = document.head.appendChild(Object.assign(document.createElement("script"), {
            type: "module",
            textContent: content + ";__webpack_exports__default.start();",
            onload: () => script.remove()
        }));
    }

    reloadStyles(): void {
        Events.dispatchEvent(new Event("reload-css"));
    }

    reload(type: "all" | "core" | "styles" | "backend"): void {
        switch (type) {
            case "core": {
                this.reloadCore();
            } break;
            case "styles": {
                this.reloadStyles();
            } break;

            case "backend": {
                (window as any).DiscordNative.app.relaunch();
            } break;
        }
    }
}

export default DevServer;