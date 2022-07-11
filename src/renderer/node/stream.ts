import {makeLazy} from "@common/util";
import EventEmitter from "./events";

export class Readable extends EventEmitter {
   constructor() {
      super(...arguments);

      ["pipe", "isPaused", "pause", "pipe", "read", "push", "wrap", "unshift", "unpipe", "resume", "_read"].forEach(i => {
         this[i] = () => {
            console.warn("Unimplemented %s", i);
            debugger;
         }
      });
   }
}

export default makeLazy(() => {
   if (window.process && !process.contextIsolated) {
      return window.require("stream");
   }

   const binding = PCCompatNative.getBinding("stream") as typeof import("src/preload/bindings/stream").default;

   const fn = function () {
      return new binding.default(...arguments);
   };

   Object.assign(fn, binding, {Readable});

   return {
      Readable
   };
});
