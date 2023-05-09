import request from '@/utils/request1';
import setting from '@/setting';

const { baseUrl } = setting;

//获取链id
export function getChain_id() {
  return request({
    url: baseUrl + '/order/get_chain_id',
    method: 'get',
  });
}

//校验用户的登录状态
export function getUserLoginStatus(data) {
  return request({
    url: baseUrl + '/user/validate_user_login',
    method: 'POST',
    data
  });
}

//导入秘钥
export function setImportPrivateKey(data) {
  return request({
    url: baseUrl + '/user/import_private_key',
    method: 'POST',
    data
  });
}

//重置密码
export function setresetPassword(data) {
  return request({
    url: baseUrl + '/user/reset_password',
    method: 'POST',
    data
  });
}

//校验密码
export function getValidatePassword(data) {
  return request({
    url: baseUrl + '/user/validate_password',
    method: 'POST',
    data,
  });
}

//保存密码
export function savePassword(data) {
  return request({
    url: baseUrl + '/user/save_password',
    method: 'POST',
    data,
  });
}
//获取私钥
export function getPrivateKey(data) {
  return request({
    url: baseUrl + '/user/get_private_key',
    method: 'POST',
    data,
  });
}
//谷歌验证校验
export function transfer_valid(data) {
  return request({
    url: baseUrl + '/assets/transfer_valid',
    method: 'POST',
    data,
  });
}
//绑定校验
export function bind_valid(data) {
  return request({
    url: baseUrl + '/assets/bind_valid',
    method: 'POST',
    data,
  });
}
//监测dmc账户是否存在
export function check_account(data) {
  return request({
    url: baseUrl + '/user/check_account',
    method: 'POST',
    data,
  });
}



