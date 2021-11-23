import {waitForDebugger, open} from "inspector";

if (process.argv.join("").includes("--debug")) {
    open();
    waitForDebugger();
}