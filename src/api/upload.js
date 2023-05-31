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
