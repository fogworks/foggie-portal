import request from "@/utils/request1";
import setting from "@/setting";

const { baseUrl } = setting;

export function getCurReferenceRate(data) {
  return request({
    url: baseUrl + "/order/get_table_rows",
    method: "get",
  });
}

export function getOrderFilterList(data) {
  return request({
    url: baseUrl + "/order/outstanding_orders",
    method: "post",
    data,
  });
}

export function buyOrder(data) {
  return request({
    url: baseUrl + "/order/buy",
    method: "post",
    data,
  });
}

export function orderSync(data) {
  return request({
    url: baseUrl + "/order/sync",
    method: "post",
    data,
  });
}
