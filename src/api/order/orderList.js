import request from '@/utils/request_miner';
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


//提交merkle树
export function pushMerkle(data) {
  return request({
    url: baseUrl + '/file/push_merkle',
    method: 'post',
    data,
  });
}

