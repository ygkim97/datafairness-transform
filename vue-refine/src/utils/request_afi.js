import axios from "axios";
import store from "@/store/index.js";

const service = axios.create({
  // baseURL을 localhost로 설정하여, proxy 설정을 맞춘다.
  baseURL: `http://localhost:${process.env.VUE_APP_PORT}`,
  timeout: 600000,
  withCredentials: true
});

// abort duplicate request
const pending = {};

service.clear = () => {
  Object.keys(pending).map((e) => {
    if (pending[e]) {
      pending[e]();
      delete pending[e];
    }
  });
};

service.interceptors.request.use(
  (config) => {
    // post는 params가 아니고, data를 사용한다.
    if (config.method !== "get") {
      config.data = config.params;
      config.params = null;
    }

    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Headers"] = "*";

    // spinnerOn
    store.commit("spinnerOn");

    return config;
  },
  (error) => {
    store.commit("spinnerOff");

    console.log(error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // spinnerOff
    store.commit("spinnerOff");

    // removePending(response.config);

    // response를 전체적으로 수정해야 할 경우, 여기서 한다.
    // response.data 가, back-end에서 넘어오는 부분이고,
    // response.status 는 front-end에서 back-end 로 axios 호출할때의 상태값이다.
    response.data.status = response.data.result === "SUCCESS";

    // back-end와의 통신중, 발생하는 error는 여기서 해결한다.
    if (response.status !== 200) {
      throw new Error("error");
    }

    // back-end response만 넘겨준다.
    return response.data;
  },
  (error) => {
    store.commit("spinnerOff");

    // removePending(error.config)
    console.log(error.config);
  }
);

export default service;
