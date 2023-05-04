import request from '@/utils/request1';
import setting from '@/setting';

const { baseUrl } = setting;

//获取当前基准价格
export function getCurReferenceRate(data) {
  return request({
    url: baseUrl + '/order/get_table_rows',
    method: 'get',
  });
}


//获取订单筛选列表
export function getOrderFilterList(data) {
  return request({
    url: baseUrl + '/order/outstanding_orders',
    method: 'post',
    data,
  });
}

//买单
export function buyOrder(data) {
  return request({
    url: baseUrl + '/order/buy',
    method: 'post',
    data,
  });
}

/* 同步订单至注册中心 */
export function orderSync(data) {
  return request({
    url: baseUrl + '/order/sync',
    method: 'post',
    data,
  });
}