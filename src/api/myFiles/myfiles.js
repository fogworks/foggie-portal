import request from "@/utils/request1";
import setting from "@/setting";

const { baseUrl } = setting;

export function GetFileList(data) {
  return request({
    url: baseUrl + "/file/list",
    method: "post",
    data,
  });
}

export function InitiateChallenge(data) {
  return request({
    url: baseUrl + "/order/req_challenge",
    method: "post",
    data,
  });
}
export function fileQuery(data) {
  return request({
    url: baseUrl + "/file/query",
    method: "post",
    data,
  });
}

