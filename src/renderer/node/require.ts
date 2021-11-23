import {createRequire} from "./module";
import path from "./path";

export default createRequire(path.resolve(PCCompatNative.executeJS("__dirname"), "plugins"));