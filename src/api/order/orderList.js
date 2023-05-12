import request from "@/utils/request1";
import setting from "@/setting";

const { baseUrl } = setting;

export function getOrderList(data) {
  return request({
    url: baseUrl + "/order/list",
    method: "post",
    data,
  });
}

export function getOrderById(data) {
  return request({
    url: baseUrl + "/order/id",
    method: "post",
    data,
  });
}

export function pushMerkle(data) {
  return request({
    url: baseUrl + "/order/push_merkle",
    method: "post",
    data,
  });
}
export function orderAssetsList(data) {
  return request({
    url: baseUrl + "/assets/list_in_order",
    method: "post",
    data,
  });
}
export function userAssetsList(data) {
  return request({
    url: baseUrl + "/assets/list_in_user",
    method: "post",
    data,
  });
}
export function userAssets(data) {
  return request({
    url: baseUrl + "/assets/user",
    method: "post",
    data,
  });
}
export function assetsTransfer(data) {
  return request({
    url: baseUrl + "/assets/transfer",
    method: "post",
    data,
  });
}

export function sync_device(data) {
  return request({
    url: baseUrl + "/order/sync_device",
    method: "post",
    data,
  });
}
export function getMerkleList(data) {
  return request({
    url: baseUrl + "/order/merkle_list",
    method: "post",
    data,
  });
}
export function getChallengeList(data) {
  return request({
    url: baseUrl + "/order/challenge_list",
    method: "post",
    data,
  });
}
export function pay_challenge(data) {
  return request({
    url: baseUrl + "/order/pay_challenge",
    method: "post",
    data,
  });
}

