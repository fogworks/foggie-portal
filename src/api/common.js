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
