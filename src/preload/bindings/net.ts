import net from "net";

// TODO: Finish net module polyfill.

const newNet = Object.fromEntries(
    Object.keys(net).map(key => [key, net[key]])
);

export default newNet;