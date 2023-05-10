import request from "@/utils/request1";
import setting from "@/setting";

const { baseUrl } = setting;

export function getChain_id() {
  return request({
    url: baseUrl + "/order/get_chain_id",
    method: "get",
  });
}

export function getUserLoginStatus(data) {
  return request({
    url: baseUrl + "/user/validate_user_login",
    method: "POST",
    data,
  });
}

export function setImportPrivateKey(data) {
  return request({
    url: baseUrl + "/user/import_private_key",
    method: "POST",
    data,
  });
}

export function setresetPassword(data) {
  return request({
    url: baseUrl + "/user/reset_password",
    method: "POST",
    data,
  });
}

export function getValidatePassword(data) {
  return request({
    url: baseUrl + "/user/validate_password",
    method: "POST",
    data,
  });
}

export function savePassword(data) {
  return request({
    url: baseUrl + "/user/save_password",
    method: "POST",
    data,
  });
}
export function getPrivateKey(data) {
  return request({
    url: baseUrl + "/user/get_private_key",
    method: "POST",
    data,
  });
}
export function transfer_valid(data) {
  return request({
    url: baseUrl + '/assets/transfer_valid',
    method: 'POST',
    data,
  });
}
export function bind_valid(data) {
  return request({
    url: baseUrl + '/assets/bind_valid',
    method: 'POST',
    data,
  });
}
export function check_account(data) {
  return request({
    url: baseUrl + '/user/check_account',
    method: 'POST',
    data,
  });
}
export function dividend_list(data) {
  return request({
    url: baseUrl + '/user/dividend_list',
    method: 'POST',
    data,
  });
}
export function claim_order(data) {
  return request({
    url: baseUrl + '/user/claim_order',
    method: 'POST',
    data,
  });
}





