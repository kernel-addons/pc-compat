const Buffer: typeof import("buffer") = {} as any;

export const setBuffer = function (buffer: any) {
    Object.assign(Buffer, buffer);

    Object.assign(window, {Buffer: buffer.Buffer});
};

export default window.Buffer ?? Buffer;
