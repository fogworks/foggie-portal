import axios from "axios";
// import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";
// import { b64EncodeUnicode } from "./util.js";

// import {
//   setToken,
//   getToken,
//   removeToken,
//   removeAccessToken,
// } from "@/utils/auth";
import { refreshToken } from "@/utils/api";
import Qs from "qs";
// import { hmac } from "./util.js";

const service = axios.create({
  timeout: 500000000, // request timeout
  // timeout: 3000, // request timeout
});
// request interceptor
service.interceptors.request.use(
  (config) => {
    if (
      config.url.indexOf("/api/paynode") > -1 ||
      config.url.indexOf("/api/payments") > -1 ||
      config.url.indexOf("/api/checkpayment") > -1 ||
      config.url.indexOf("/api/completepayment") > -1
    ) {
      // let headerKey = hmac();
      // let header = {};
      // header = {
      //   ApiKey: headerKey.ApiKey,
      //   Signature: headerKey.Signature,
      // };
      // config.headers = header;
    } else if (config.url.indexOf("/v2/payments") > -1) {
      let header = {};
      header = {
        Authorization: config.headers.Authorization,
        "Square-Version": config.headers["Square-Version"],
        "Content-Type": "application/json",
      };
      config.headers = header;
    } else if (config.url.indexOf("/api/accounts/refresh_token") > -1) {
      let header = {};
      let refresh_token = window.localStorage.getItem("refresh_token");
      header = {
        Authorization: refresh_token,
        "Content-Type": "application/json",
      };
      config.headers = header;
    } else if (
      config.url.indexOf("/metrics/Info") > -1 ||
      config.url.indexOf("/q/query") > -1
    ) {
      let apiUser = "apiUser:5eXEt9rNhT7RB6WoeC38eK";
      let token = b64EncodeUnicode(apiUser);
      let header = {};
      header = {
        Authorization: `Basic ${token}`,
      };
      config.headers = header;
    } else {
      if (
        config.url === "/api/accounts/login" &&
        config["Content-Type"] === "application/x-www-form-urlencoded"
      ) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        config.data = Qs.stringify(config.data);
      } else if (
        config["Content-Type"] === "multipart/form-data" &&
        config.url.indexOf("u2i.net") > -1
      ) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else if (config.url === "/object") {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      if (store.getters.token) {
        // config.headers["Authorization"] = `${getToken()}`;
        config.headers["Authorization"] = process.env.VUE_APP_TOKEN;
      }
      let refresh_token = window.localStorage.getItem("refresh_token");
      config.headers["Authorization"] = refresh_token;

      // config.headers["Authorization"] =
      //   "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA1OTYyMTUsInVzZXJuYW1lIjoiVkYzNTYyNTg1MjQyOTI4MSIsImVtYWlsIjoiaGFoYTMzNTIxY3MxMzBAMTYzLmNvbSIsImF1dGhvcml6ZWQiOnRydWUsImFjY291bnQiOiJmb2dnaWV6enp6ejIifQ.OwFoKCE0MmVDL493_ka7aBi0Tt4zgnnnr3H-79sZjF0";

      if (config.url.indexOf("part_number") > -1) {
        config.headers["Content-Type"] = "multipart/form-data";
        config.headers["Content-Md5"] = config.MD5;
      }
      if (config.url.indexOf("/v1") > -1) {
        let access_token = window.localStorage.getItem("access_token");
        config.headers["Authorization"] = access_token;

      }
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  async (response) => {
    const res = response.data;
    if (
      response.config.url.indexOf("/api/paynode") > -1 ||
      response.config.url.indexOf("/api/payments") > -1 ||
      response.config.url.indexOf("/api/checkpayment") > -1 ||
      response.config.url.indexOf("/api/completepayment") > -1
    ) {
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        return res;
      }
    }
    let code = res && res.code;
    if (
      response.config.url.indexOf("/x/asset") > -1 &&
      response.status === 200 &&
      code === 400
    ) {
      return res;
    }
    if (code && code !== 200) {
      if (code === 401 || code === 403) {
        // removeToken();
        // removeAccessToken();
        // router.push("/login");
        router.push("/user");
        // Message({
        //   message: res.error || "Error",
        //   type: "error",
        //   duration: 5 * 1000,
        // });
        return;
      } else if (code === 420) {

        let res = await refreshToken();

        if (res && res.data && res.data.access_token) {
          let token = res.data.access_token;
          let type = res.data.token_type;
          token = type + " " + token;
          let userInfo = {
            username: "",
            token: token, //res.token
            user_id: "",
          };
          store.dispatch("token/login", userInfo);
          window.localStorage.setItem("last_refresh_token", token);
          //   setToken(token);
          return service(response.config);
        } else {
          //   Message({
          //     message: res.data.error || "Error",
          //     type: "error",
          //     duration: 5 * 1000,
          //   });
          return;
        }
        // refreshToken().then(res => {
        //   // console.log('getrefreshToken', res, response);
        //   if (res && res.data) {
        //     let token = res.data.access_token;
        //     let type = res.data.token_type;
        //     token = type + ' ' + token;
        //     let userInfo = {
        //       username: "",
        //       token: token, //res.token
        //       user_id: "",
        //     };
        //     store.dispatch("login", userInfo);
        //     setToken(token);
        //     return service(response.config);
        //   }
        // })
      } else {
        // Message({
        //   message: res.error || "Error",
        //   type: "error",
        //   duration: 5 * 1000,
        // });
        return Promise.reject(res);
        // return;
      }
    }
    if (response.status === 401 || response.status === 403) {
      //   removeToken();
      //   removeAccessToken();
      router.push("/user");
      return;
    }
    if (response.status === 400) {
      let errors = "";
      if (response.errors && response.errors[0] && response.errors[0].detail) {
        errors = response.errors[0].detail;
      }
      //   Message({
      //     message: errors || "Error",
      //     type: "error",
      //     duration: 5 * 1000,
      //   });
      return;
    }
    if (response.status === 204) {
      return res;
    }
    if (response.status !== 200) {
      //   Message({
      //     message: res.message || "Error",
      //     type: "error",
      //     duration: 5 * 1000,
      //   });
      return Promise.reject(new Error(res.message || "Error"));
    } else if (response.status === 200) {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    if (!error.config.url.indexOf("ping")) {
      //   Message({
      //     message: error.message,
      //     type: "error",
      //     duration: 5 * 1000,
      //   });
    }

    return Promise.reject(error);
  }
);

//base64，js原生方法btoa()实现
function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode("0x" + p1);
    })
  );
}

export default service;
