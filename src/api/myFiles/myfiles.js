
import request from '@/utils/request1';
import setting from '@/setting';

const { baseUrl } = setting;


// 获取文件列表

export function GetFileList(data) {
  return request({
    url: baseUrl + '/file/list',
    method: 'post',
    data,
  });
}

/* 发起挑战 */
export function InitiateChallenge(data) {
  return request({
    url: baseUrl + '/file/req_challenge',
    method: 'post',
    data,
  });
}