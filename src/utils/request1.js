import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import _ from 'lodash';
import { getToken, removeToken } from '@/utils/auth';
import router from "@/router";

import store from '@/store';


const service = axios.create({
  timeout: 5000000,
});

let loadingInstance = null

const blackList = ['/file/upload', '/file/save','/file/create','/file/complete']  // 加载黑名单

service.interceptors.request.use(

  config => {


    if (!blackList.some(item => config.url.indexOf(item) > -1)) {
      loadingInstance = ElLoading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.4)' })
    }


    config.headers.Authorization = getToken() || '';
    return config;
  },
  error => {
    return Promise.reject(new Error(error));
  }
);

// 响应拦截器
service.interceptors.response.use(
  async response => {
    const _response = _.has(response, 'data') && _.isObject(response.data) && _.has(response.data, 'code') ? response.data.data : { code: 10001, errmsg: '网络出错' };

    if (response.config.url.indexOf('validate_user_login') > -1) {
      /* 校验用户的登录状态  code 10001 密码不存在 10002 密码存在*/


    } else {
      if (_response.code !== 200) {
        ElMessage({
          message: _response.msg,
          grouping: true,
          type: 'error',
        })
      }
    }



    // // Token 失效
    // if (_response.code === 10001) {
    //   removeToken();
    //   router.push({ path: '/loginBox', query: { redirect: router.currentRoute.path } });

    // }

    loadingInstance ? loadingInstance.close() : ''


    return _response;
  },
  error => {
    loadingInstance ? loadingInstance.close() : ''

    ElMessage.error(error.response.data.msg || error.msg);
    return Promise.reject(error)
  }
);

export default service;
