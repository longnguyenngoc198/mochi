import axios from "axios";
import Raven from "raven-js";
const ROOT_LINK = process.env.REACT_APP_ROOT_LINK;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
// axios.defaults.headers.post["Content-Type"] =
//   "application/json";
// axios.defaults.headers.common["privateKey"] = "M0ch1M0ch1_Jp_$ecret_k3y";
// axios.defaults.headers.common["deviceType"] = '4';
// axios.defaults.headers.common["appVersion"] = 'v3.1';
const getClient = (baseUrl = null) => {
  const options = {
    baseURL: baseUrl ? baseUrl : ROOT_LINK + "/",
  };
  options.headers = {
    deviceType: "4",
    appVersion: "v3.1",
    privateKey: "M0ch1M0ch1_Jp_$ecret_k3y",
    "Content-Type": "application/json",
  };
  const client = axios.create(options);
  
    // Add a response interceptor
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status >= 500) {
          Raven.captureException(error);
        }
        return Promise.reject(error);
      }
  );
  return client;
};
class ApiClient {
  constructor(baseUrl = null) {
    this.client = getClient(baseUrl);
  }
  
  get(endpoint, conf = {}) {
    return this.client
      .get(endpoint, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
  delete(endpoint, conf = {}) {
    return this.client
      .delete(endpoint, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
  head(endpoint, conf = {}) {
    return this.client
      .head(endpoint, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
  options(endpoint, conf = {}) {
    return this.client
      .options(endpoint, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
  post(endpoint, data = {}, conf = {}) {
    return this.client
      .post(endpoint, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
  put(endpoint, data = {}, conf = {}) {
    return this.client
      .put(endpoint, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
  patch(endpoint, data = {}, conf = {}) {
    return this.client
      .patch(endpoint, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
}
export { ApiClient };
/**
 * Base HTTP Client
 */
// export default {
//   // Provide request methods with the default base_endpoint
//   get(url, conf = {}) {
//     return getClient()
//       .get(url, conf)
//       .then((response) => Promise.resolve(response))
//       .catch((error) => Promise.reject(error));
//   },
//   delete(url, conf = {}) {
//     return getClient()
//       .delete(url, conf)
//       .then((response) => Promise.resolve(response))
//       .catch((error) => Promise.reject(error));
//   },
//   head(url, conf = {}) {
//     return getClient()
//       .head(url, conf)
//       .then((response) => Promise.resolve(response))
//       .catch((error) => Promise.reject(error));
//   },
//   options(url, conf = {}) {
//     return getClient()
//       .options(url, conf)
//       .then((response) => Promise.resolve(response))
//       .catch((error) => Promise.reject(error));
//   },
//   post(url, data = {}, conf = {}) {
//     return getClient()
//       .post(url, data, conf)
//       .then((response) => Promise.resolve(response))
//       .catch((error) => Promise.reject(error));
//   },
//   put(url, data = {}, conf = {}) {
//     return getClient()
//       .put(url, data, conf)
//       .then((response) => Promise.resolve(response))
//       .catch((error) => Promise.reject(error));
//   },
//   patch(url, data = {}, conf = {}) {
//     return getClient()
//       .patch(url, data, conf)
//       .then((response) => Promise.resolve(response))
//       .catch((error) => Promise.reject(error));
//   },
// };
