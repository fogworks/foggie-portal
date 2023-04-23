
import request from '@/utils/request_miner';
import setting from '@/setting';

const { baseUrl } = setting;


// 文件本地保存 

export function GetFileList(data) {
  return request({
    url: baseUrl + '/file/list',
    method: 'post',
    data,
  });
}
