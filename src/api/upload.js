import request from "@/utils/request1";
import setting from "@/setting";

const { baseUrl } = setting;

export function fileUpload(data, controller, callback) {
  return request({
    url: baseUrl + "/file/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 600000,
    // timeout: 1000,

    data,
    signal: controller.signal,
    onUploadProgress: function (progressEvent) {
      if (progressEvent.event.lengthComputable) {
        if (data.get("fileCategory") == "1") {
          callback(progressEvent);
        } else if (data.get("fileCategory") == "2") {
          callback(progressEvent, Number(data.get("partId")));
        }
      }
    },
  });
}

export function uploadMultipart(data) {
  return request({
    url: baseUrl + "/file/create",
    method: "post",
    data,
  });
}

export function fileCompletesApi(data) {
  return request({
    url: baseUrl + "/file/complete",
    method: "post",
    data,
  });
}

export function SaveFile(data) {
  return request({
    url: baseUrl + "/file/save",
    method: "post",
    data,
  });
}







/* ------------------- */


export function isCanUpload_Api(data) {
  return request({
    url: baseUrl + "/file/upload_valid",
    method: "post",
    data,
  });
}



export function fileUploadApi(data) {
  return request({
    url: baseUrl + "/file/zero_copy_upload",
    method: "post",
    timeout: 600000,
    data,
  });
}
export function byMd5GetUploadProgress(data) {
  return request({
    url: baseUrl + "/file/get_by_name",
    method: "post",
    timeout: 10000,
    data,
  });
}

export function deleteUploadFile_Api(data) {
  return request({
    url: baseUrl + "/file/delete",
    method: "post",
    timeout: 10000,
    data,
  });
}


export function cancelUpload_Api(data) {
  return request({
    url: baseUrl + "/file/cancel_upload",
    method: "post",
    data,
  });
}

export function resumeUpload_Api(data) {
  return request({
    url: baseUrl + "/file/breakpoint_resume",
    method: "post",
    data,
  });
}


export function getFileListByState_Api(data) {
  return request({
    url: baseUrl + "/file/list_by_state",
    method: "post",
    data,
  });
}


export function uploadFolder(data) {
  return request({
    url: baseUrl + "/file/upload_dir_valid",
    method: "post",
    data,
  });
}
export function getfileListByState(data) {
  return request({
    url: baseUrl + "/file/list_by_state",
    method: "post",
    data,
  });
}

export function changeFileState(data) {
  return request({
    url: baseUrl + "/file/update_state",
    method: "post",
    data,
  });
}