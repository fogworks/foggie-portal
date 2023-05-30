import request from "@/utils/request";
import setting from "@/setting";

const { apiUrl, baseUrl, portNum } = setting;



export const register = (data) => {
  return request({
    url: `${apiUrl}/api/accounts/user`,
    method: "POST",
    data: data,
  });
};

export const login = (data) => {
  return request({
    url: `${apiUrl}/api/accounts/login`,
    method: "POST",
    data: data,
    "Content-Type": "application/x-www-form-urlencoded",
  });
};

export const logouts = (data) => {
  return request({
    url: `${apiUrl}/api/accounts/logout`,
    method: "POST",
    data: data,
  });
};
export const user = () => {
  return request({
    url: `${apiUrl}/api/accounts/info`,
    method: "GET",
  });
};
export const Captcha = () => {
  return request({
    url: `${apiUrl}/api/accounts/captcha`,
    method: "GET",
  });
};
export const updateUser = (id, data) => {
  return request({
    url: `${apiUrl}/api/accounts/user/${id}`,
    method: "PUT",
    data: data,
  });
};
export const paynode = () => {
  return request({
    url: `${apiUrl}/api/paynode`,
    method: "GET",
  });
};

export const createPayments = (data) => {
  return request({
    url: `${apiUrl}/api/payments`,
    method: "POST",
    data: data,
  });
};

export const checkpayment = (uuid) => {
  return request({
    url: `${apiUrl}/api/checkpayment?uuid=${uuid}`,
    method: "GET",
  });
};

export const completepayment = (data) => {
  return request({
    url: `${apiUrl}/api/completepayment`,
    method: "POST",
    data: data,
  });
};

export const transactions = (data) => {
  return request({
    url: `${apiUrl}/api/oms/transactions`,
    method: "POST",
    data: data,
  });
};

export const refreshToken = () => {
  return request({
    url: `${apiUrl}/api/accounts/refresh_token`,
    method: "POST",
  });
};

//File LIST
export const oodFileList = (email, type, token, deviceData, prefix) => {
  let url = `${baseUrl}/list_files`,
    // prefix = "",
    delimiter = "/",
    max_keys = "50",
    start_after = "",
    continuation_token = "",
    version_id_marker = "",
    key_marker = "";
  let data = {
    prefix,
    delimiter,
    max_keys,
    start_after,
    continuation_token,
    version_id_marker,
    key_marker,
    deviceData,
    type,
    token,
    email
  };

  return request({
    url: url,
    method: "POST",
    data,
  });
};

export const find_objects = (email, type, token, deviceData, key_marker) => {
  let url = `${baseUrl}/find_objects`,
    prefix = "",
    delimiter = "/",
    max_keys = "50",
    start_after = "",
    continuation_token = "",
    version_id_marker = "";
  let data = {
    prefix,
    delimiter,
    max_keys,
    start_after,
    continuation_token,
    version_id_marker,
    key_marker,
    deviceData,
    token,
    email,
    type
  };

  return request({
    url: url,
    method: "POST",
    data,
  });
};

//pin task LIST
export const oodTaskList = (ID, next_marker, prefix) => {
  let url = "";
  if (prefix) {
    url = `/ipfsops/task/list?prefix=${prefix}`; //&delimiter=/
    if (next_marker) {
      url = `${url}&marker=${next_marker}`;
    }
  } else {
    url = next_marker
      ? `/ipfsops/task/list?marker=${next_marker}`
      : `/ipfsops/task/list`;
  }

  return request({
    url: url,
    method: "GET",
  });
};
export const oodFileStatus = (ID, type) => {
  let url = `/stats?st_type=${type}`;
  // let url = '/ping?t=1111';
  return request({
    url: url,
    method: "GET",
  });
};

export const file_delete = (token, item, deviceData) => {
  let objects = [
    { pubkey: item.pubkey ? item.pubkey : encodeURIComponent(item.key) },
  ];
  let cids = [item.cid];
  let object_type = item.type;
  let url = `${baseUrl}/file_delete`;
  let data = {
    deviceData,
    cids,
    objects,
    object_type,
    token
  };
  return request({
    url: url,
    method: "DELETE",
    data,
  });
};

export const oodFileSearch = (key) => {
  // let url = `/o/${ID}/find?key=${key}`;
  let url = `/find?key=${key}`;
  return request({
    url: url,
    method: "GET",
  });
};

export const oodMonitor = (item) => {
  let url = `/metrics/Info?size=${item.size}&field_value=${item.field_value}&miner_ids=${item.miner_ids}&metrics_type=${item.metrics_type}&by_date=${item.date}`;
  return request({
    url: url,
    method: "GET",
  });
};

export const getActivationVood = (data, target) => {
  let path = `/v1/get_service_info`;
  return request({
    path: path,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    type: 'GET',
    port: portNum,
    target,
    data: {
      param: "",
    },
  });
};

//ipns publish list
export const pIN = (data) => {
  let url = `/ipfsops/pin`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

//ipns publish list
export const publishPin = (data) => {
  let url = `${baseUrl}/publish`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

//ipns publish list
export const IPFSSync = (ood_id, data) => {
  let url = `ipfsops/sync`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

export const voodInfoCheck = (vpsId, target) => {
  return request({
    path: `/v1/service/check_cyfs`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    type: "GET",
    port: portNum,
    target,
    data: {
      param: "",
    },
  });
};

export const voodActivate = (data) => {
  return request({
    url: `${apiUrl}/api/vps/vood_activate`,
    method: "POST",
    data: data,
  });
};
export const check_coupon_number = (coupon_num) => {
  if (coupon_num && coupon_num !== null) {
    return request({
      url: `${apiUrl}/api/coupon/check_coupon_number?coupon_number=${coupon_num}`,
      method: "GET",
    });
  }
};
export const orderRecharge = (data) => {
  return request({
    url: `${apiUrl}/api/oms/order_renewal`,
    method: "POST",
    data: data,
  });
};
export const OwnerBills = (account) => {
  if (account && account !== null) {
    let url = `/x/bills?owner_id=${account}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

export const dmcSwap = () => {
  let url = `/x/swapmarket`;
  return request({
    url: url,
    method: "GET",
  });
};

/**
 * @param {String} fileName 
 * @param {String} upload_id 
 * @param {String} cid  
 * @param {object} data  
 * @param {String} fileType 
 *  */
export const uploadMultipart = (params) => {
  const {
    dedicatedip,
    isGateway,
    device_id,
    fileName,
    upload_id,
    cid,
    data,
    fileType,
  } = params;
  let url = "";
  // if (isGateway) {
  //   url = `https://${device_id}.${
  //     process.env.VUE_APP_UPLOAD_URL
  //   }/mp/${encodeURIComponent(fileName)}?upload_id=${
  //     upload_id ?? ""
  //   }&content_type=${fileType}`;
  // } else {
  //   url = `/o/${device_id}/mp/${encodeURIComponent(fileName)}?upload_id=${
  //     upload_id ?? ""
  //   }&content_type=${fileType}`;
  // }

  url = `/mp/${encodeURIComponent(fileName)}?upload_id=${upload_id ?? ""
    }&content_type=${fileType}`;

  let obj = {
    url: url,
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  if (data) {
    obj.data = data;
  }
  return request(obj);
};

export const fileShare = (ood_id, data) => {
  let url = `o/${ood_id}/presignurl`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

export const awardTaskList = (ood_id) => {
  if (ood_id && ood_id !== null) {
    return request({
      url: `/x/tasklist?ood_id=${ood_id}`,
      method: "GET",
    });
  }
};

//003
export const finishTask = (data) => {
  return request({
    url: "/x/reward_active",
    method: "POST",
    data: data,
  });
};

export const rewardReceive = (data) => {
  return request({
    url: "/x/reward_receive",
    method: "POST",
    data: data,
  });
};

export const ydaReward = (owner_id, type) => {
  if (owner_id && owner_id !== null) {
    let url = "";
    if (type === "account") {
      url = `/x/tda_reward?owner_id=${owner_id}&source=all`;
    } else {
      url = `/x/tda_reward?ood_id=${owner_id}&source=all`;
    }
    // `/x/yda_reward?owner_id=${owner_id}`,
    return request({
      url: url,
      method: "GET",
    });
  }
};

export const historyReward = (ID, page, limit) => {
  if (ID && ID !== null) {
    let url = `/x/${ID}/reward?page=${page}&limit=${limit}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

export const shareLink = (ID, key) => {
  if (ID && ID !== null) {
    let url = `/lookup?key=${key}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

export const withdrawDMC = (data) => {
  return request({
    url: "/x/withdraw",
    method: "POST",
    data: data,
  });
};
export const getGoogle = (owner_id) => {
  if (owner_id && owner_id !== null) {
    return request({
      url: "/x/verify_withdraw?owner_id=" + owner_id,
      method: "GET",
    });
  }
};

export const getAssets = (owner_id) => {
  if (owner_id && owner_id !== null) {
    return request({
      url: "/x/asset?owner_id=" + owner_id,
      method: "GET",
    });
  }
};

export const getWithdrawList = (owner_id, page, limit) => {
  if (owner_id && owner_id !== null) {
    return request({
      url: `x/withdraw?owner_id=${owner_id}&page=${page}&limit=${limit}`,
      method: "GET",
    });
  }
};

export const lastweekReward = (account) => {
  if (account && account !== null) {
    let url = `/x/lastweek_reward?owner_id=${account}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

export const CidShare = (OODID, CID) => {
  if (OODID && CID) {
    let url = `/o/${OODID}/${CID}/share`;
    // let url = `/share?cid=${CID}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

export const getWithdrawGoogle = (data) => {
  return request({
    url: "/x/otp",
    method: "POST",
    data: data,
  });
};

export const verifyGoogle = (data) => {
  return request({
    url: "/x/verify_otp",
    method: "POST",
    data: data,
  });
};
export const withdrawGoogle = (data) => {
  return request({
    url: "/x/withdraw_otp",
    method: "POST",
    data: data,
  });
};

export const deploy_cbs = (target) => {
  return request({
    path: `/v1/service/deploy_cbs`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    target,
    data: {},
  });
};
export const deploy_ipfs = (target) => {
  return request({
    path: `/v1/service/deploy_ipfs`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    target,
    data: {},
  });
};
export const deploy_cyfs = (data, target) => {
  return request({
    path: `/v1/service/deploy_cyfs`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const activate_sev = (target) => {
  return request({
    path: `/v1/service/activate_sev`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    target,
    data: {},
  });
};


export const get_service_info = (target) => {
  return request({
    path: `/v1/get_service_info`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    target, //{ip,device_id}
    type: "GET",
    port: portNum,
    data: {
      param: "",
    },
  });
};

export const get_foggie_dmc = (data) => {
  return request({
    url: `${apiUrl}/api/accounts/get_foggie_dmc`,
    method: "POST",
    data,
  });
};
export const bind_foggie = (data, target) => {
  return request({
    path: `/v1/account/bind_foggie`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const unbind_foggie = (target) => {
  return request({
    path: `/v1/account/unbind_foggie`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    target,
    data: {},
  });
};

export const search_foggie = (data) => {
  return request({
    url: `${apiUrl}/api/accounts/search_foggie`,
    method: "POST",
    data,
  });
};
export const checkAccount = (data, target = {}) => {
  return request({
    path: "/v1/chain/get_account",
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const modify_access_password = (data, target) => {
  return request({
    path: `/v1/account/modify_access_password`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const check_access_pass = (target) => {
  return request({
    path: `/v1/account/check_access_pass`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    target,
    type: "GET",
    port: portNum,
    data: {
      param: "",
    },
  });
};
export const access_pass = (data, target) => {
  return request({
    path: `/v1/account/access_pass`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const access_pass_login = (data, target) => {
  return request({
    path: `/v1/account/access_pass_login`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const op_ipfs = (data, target) => {
  return request({
    url: `/v1/service/op_ipfs`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const op_cyfs = (data, target) => {
  return request({
    path: `/v1/service/op_cyfs`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    data,
    target,
  });
};
export const reset_vood = (target) => {
  return request({
    path: `/v1/service/reset_vood`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    target,
    data: {},
  });
};
export const detected_net = (target) => {
  return request({
    path: `/v1/detected_net`,
    url: `${baseUrl}/proxy/http`,
    method: "POST",
    port: portNum,
    target,
    type: 'GET',
    data: {
      param: "",
    },
  });
};






//getIP
export const getIP = () => {
  let url = `${baseUrl}/getIP`;
  return request({
    url: url,
    method: "GET",
  });
};

//portalPing
export const portalPing = (data) => {
  let url = "${baseUrl}/portal_ping";
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

//socket_ip
export const socketIP = (data) => {
  let url = "${baseUrl}/socket_ip";
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

//ping_url
export const pingUrl = (data) => {
  let url = "${baseUrl}/get_max_info";
  return request({
    url: url,
    method: "POST",
    data,
  });
};

//get_net_status
export const getNetStatus = (data) => {
  let url = `${baseUrl}/get_net_status`;
  return request({
    url: url,
    method: "POST",
    data,
  });
};

export const search_object = (data) => {
  let url = `${baseUrl}/search_object`;
  return request({
    url: url,
    method: "POST",
    data,
  });
};

export const get_vood_token = (params) => {
  let url = `${apiUrl}/api/accounts/get_vood_token`;
  return request({
    url: url,
    method: "get",
    params,
  });
};
export const get_vood_refresh_token = (params) => {
  let url = `${apiUrl}/api/accounts/get_vood_refresh_token`;
  return request({
    url: url,
    method: "get",
    params,
  });
};


