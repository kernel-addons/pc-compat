import crypto from "crypto";

// TODO: Finish crypto module polyfill.

const newCrypto = Object.fromEntries(
    Object.keys(crypto).map(key => [key, crypto[key]])
);

export default newCrypto;