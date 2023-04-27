
import request from '@/utils/request1';
import setting from '@/setting';

const { baseUrl } = setting;

//文件上传
export function fileUpload(data, controller, callback) {

  return request({
    url: baseUrl + '/file/upload',
    method: 'post',
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 600000,
    data,
    signal: controller.signal,
    onUploadProgress: function (progressEvent) {
      //原生获取上传进度的事件
      if (progressEvent.event.lengthComputable) {
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        if (data.get('fileCategory') == '1') {
          callback(progressEvent);
        } else if (data.get('fileCategory') == '2') {
          callback(progressEvent, Number(data.get('partId')));
        }
      }
    },
  });
}

//文件创建
export function uploadMultipart(data) {
  return request({
    url: baseUrl + '/file/create',
    method: 'post',
    data,

  });
}

//文件提交
export function fileComplete(data) {
  return request({
    url: baseUrl + '/file/complete',
    method: 'post',
    data,
  });
}

// 文件本地保存 
export function SaveFile(data) {
  return request({
    url: baseUrl + '/file/save',
    method: 'post',
    data,
  });
}
