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
//单个端的资产列表
export function orderAssetsList(data) {
  return request({
    url: baseUrl + '/assets/list_in_order',
    method: 'post',
    data,
  });
}
//总的用户资产信息列表
export function userAssetsList(data) {
  return request({
    url: baseUrl + '/assets/list_in_user',
    method: 'post',
    data,
  });
}
//用户资产总览
export function userAssets(data) {
  return request({
    url: baseUrl + '/assets/user',
    method: 'post',
    data,
  });
}
//转账
export function assetsTransfer(data) {
  return request({
    url: baseUrl + '/assets/transfer',
    method: 'post',
    data,
  });
}


export function sync_device(data) {
  return request({
    url: baseUrl + '/order/sync_device',
    method: 'post',
    data,
  });
}




