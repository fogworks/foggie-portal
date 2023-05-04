import request from '@/utils/request1';
import setting from '@/setting';

const { baseUrl } = setting;

//获取用户的订单列表
export function getOrderList(data) {
  return request({
    url: baseUrl + '/order/list',
    method: 'post',
    data,
  });
}


/* 根据订单id获取订单 */
export function getOrderById(data) {
  return request({
    url: baseUrl + '/order/id',
    method: 'post',
    data,
  });
}


//提交merkle树
export function pushMerkle(data) {
  return request({
    url: baseUrl + '/order/push_merkle',
    method: 'post',
    data,
  });
}

