const Buffer = {};

export const setBuffer = function (buffer: any) {
    Object.assign(Buffer, buffer);

    window.Buffer = buffer.Buffer;
};

export default Buffer;