import stream from "stream";

const newStream = {
    default: stream
};

for (const key in stream) newStream[key] = stream[key];

export default newStream;