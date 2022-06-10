import fs from "fs";
import path from "path";
import {WebSocketServer} from "ws";

const port = 5959;
const print = (...message) => console.log(new Date().toLocaleTimeString(), "[WS]", ...message);

print("Starting development server...");
const wss = new WebSocketServer({port});

const tryJSON = function (json) {
    try {
        return JSON.parse(json);
    } catch (error) {
        return false;
    }
};

class DevServer {
    _connection = null;
    _helloTimeout = null;

    constructor() {
        wss.on("connection", (ws) => {
            this._connection = ws;
            print("Connection requested");
            ws.on("message", this.handleMessage);
            ws.on("close", () => {
                print("Connection closed");
                print("-----------------");
                this._connection = null;
            });

            this.send("HELLO");

            this._helloTimeout = setTimeout(() => {
                ws.close(undefined, "No HELLO received after 1 minute");
            }, 60 * 1000);
        });
    }

    handleMessage = (event) => {
        const message = tryJSON(event);
        if (!message) return print("Could not parse message");

        switch (message.operation) {
            case "HELLO": {
                clearTimeout(this._helloTimeout);
                print("Received HELLO");
                print(`Connected to ${message.data.client}`);
            } break;

            case "CLOSE": {
                this._connection.close();
            } break;
        }
    }

    send(operation, data) {
        if (!this._connection) return print("Not connected");

        print("SEND", operation);
        this._connection.send(JSON.stringify({
            operation: operation,
            data
        }));
    }
}

const server = new DevServer();
print(`Server started on ws://localhost:${port}`);

const distFolder = path.join(import.meta.url.slice("file:".length + 3), "..", "..", "dist");
const cache = {};
fs.watch(distFolder, {persistent: true}, (_, filename) => {
    const location = path.join(distFolder, filename)
    if (!fs.existsSync(location)) return; // TODO: Handle file deletions.
    if (fs.statSync(location).mtime.getTime() === cache[location]) return;
    cache[location] = fs.statSync(location).mtime.getTime();

    switch (filename) {
        case "style.css": {
            server.send("RELOAD_STYLES");
        } break;

        case "preload.js": {
            server.send("RELOAD_BACKEND");
        } break;
        case "renderer.js": {
            server.send("RELOAD_CORE");
        } break;

        case "main.js": {
            server.send("RELOAD_INJECTOR");
        } break;
    }
});