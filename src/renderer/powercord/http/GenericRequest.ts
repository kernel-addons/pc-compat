import LoggerModule from "@modules/logger";
import * as https from "@node/https";
import * as http from "@node/http";

const Logger = LoggerModule.create("HTTP");

const serializeQuery = (query: {[s: string]: string}) =>
    Object.entries<string>(query)
        .reduce((acc, [key, value]) => acc.concat(`${key}=${encodeURIComponent(value)}`), []).join("&");

class HTTPError extends Error {
    constructor(message, res) {
        super(message);
        Object.assign(this, res);
        this.name = this.constructor.name;
    }
}

interface GenericRequest {
    opts: {
        method: string,
        uri: string,
        query: {[s: string]: string},
        headers: object,
        data?: any;
    },
    _res: any;
}

class EnumerableURL extends URL {
    toJS() {
        const out = {};

        for (const name of Object.getOwnPropertyNames(this.constructor.prototype.__proto__)) {
            if (typeof this[name] === "function" || name === "searchParams") continue;

            out[name] = this[name];
        }

        return out;
    }
}

class GenericRequest {
    constructor(method: string, uri: string) {
        this.opts = {
            method,
            uri,
            query: {},
            headers: {
                "User-Agent": navigator.userAgent
            }
        };
    }

    _objectify(key, value) {
        return key instanceof Object
            ? key
            : { [key]: value };
    }

    query(key, value) {
        Object.assign(this.opts.query, this._objectify(key, value));
        return this;
    }

    set(key, value) {
        Object.assign(this.opts.headers, this._objectify(key, value));
        return this;
    }

    send(data) {
        if (data instanceof Object) {
            const serialize = this.opts.headers["Content-Type"] === "application/x-www-form-urlencoded"
                ? serializeQuery
                : JSON.stringify;

            this.opts.data = serialize(data);
        } else {
            this.opts.data = data;
        }

        return this;
    }

    execute() {
        return new Promise((resolve, reject) => {
            const opts = Object.assign({}, this.opts);
            Logger.debug("Performing request to", opts.uri);

            const url = new EnumerableURL(opts.uri);
            const {request} = url.protocol === "https:"
                ? https
                : http;

            if (Object.keys(opts.query)[0]) {
                opts.uri += `?${serializeQuery(opts.query)}`;
            }

            const options = Object.assign({}, opts, url.toJS());

            const req = request(options, (res) => {
                const data = [];

                res.on("data", (chunk) => {
                    data.push(chunk);
                });

                res.once("error", reject);

                res.once("end", () => {
                    const raw = Buffer.concat(data);

                    const result = {
                        raw,
                        body: (() => {
                            if ((/application\/json/).test(res.headers["content-type"])) {
                                try {
                                    return JSON.parse(raw.toString());
                                } catch (_) { }
                            }

                            return raw;
                        })(),
                        ok: res.statusCode >= 200 && res.statusCode < 400,
                        statusCode: res.statusCode,
                        statusText: res.statusMessage,
                        headers: res.headers
                    };

                    if (result.ok) {
                        resolve(result);
                    } else {
                        reject(new HTTPError(`${res.statusCode} ${res.statusMessage}`, result));
                    }
                });
            });

            req.once("error", reject);

            if (this.opts.data) {
                req.write(this.opts.data);
            }

            req.end();
        });
    }

    then(resolver, rejector) {
        if (this._res) {
            return this._res.then(resolver, rejector);
        }

        return (
            this._res = this.execute().then(resolver, rejector)
        );
    }

    catch(rejector) {
        return this.then(null, rejector);
    }
}

export default GenericRequest;
