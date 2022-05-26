import {makeEmitter} from "../util";
import http from "http";

const events = ["data", "end", "close"];
const headers = ["statusCode", "statusMessage", "url", "headers", "method", "aborted", "complete", "rawHeaders", "end"];

export function get(url: string, options: any) {
    const emitter = makeEmitter();

    const req = http.get(url, options, res => {
        for (const event of events) {
            res.on(event, (...args) => {
                if (event === "end") {
                    args.unshift(
                        Object.fromEntries(headers.map(h => [h, res[h]]))
                    );
                }

                emitter.emit(event, ...args);
            });
        }
    });
    
    Object.assign(emitter, {
        end: () => req.end()
    });

    return emitter as typeof emitter & {end: Function};
}

export const request = get;