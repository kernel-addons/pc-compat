import { default as GenericRequest } from "./GenericRequest";

export default {
  get (url) {
    return new GenericRequest("GET", url);
  },

  post (url) {
    return new GenericRequest("POST", url);
  },

  patch (url) {
    return new GenericRequest("PATCH", url);
  },

  put (url) {
    return new GenericRequest("PUT", url);
  },

  del (url) {
    return new GenericRequest("DELETE", url);
  },

  head (url) {
    return new GenericRequest("HEAD", url);
  }
};
