export type LogType = "log" | "warn" | "info" | "error";

export default class Logger {
    static #parseType(type: LogType) {
        switch (type) {
            case "info":
            case "warn":
            case "error":
                return type;
            default:
                return "log";
        }
    }

    static _log(type: LogType, module: string, ...message: any[]) {
        console[this.#parseType(type)](`%c[Powercord:${module}]%c`, "color: #7289da; font-weight: 700;", "", ...message);
    }

    static log(module: string, ...message: any[]) {this._log("log", module, ...message);}
    static info(module: string, ...message: any[]) {this._log("info", module, ...message);}
    static warn(module: string, ...message: any[]) {this._log("warn", module, ...message);}
    static error(module: string, ...message: any[]) {this._log("error", module, ...message);}
}