import request from "@/utils/request";



// 注册用户
export const register = (data) => {
  return request({
    url: "/api/accounts/user",
    method: "POST",
    data: data,
  });
};

// 登录用户
export const login = (data) => {
  return request({
    url: "/api/accounts/login",
    method: "POST",
    data: data,
    "Content-Type": "application/x-www-form-urlencoded",
  });
};

//退出登录
export const logouts = (data) => {
  return request({
    url: "/api/accounts/logout",
    method: "POST",
    data: data,
  });
};
export const user = () => {
  return request({
    url: "/api/accounts/info",
    method: "GET",
  });
};


//支付方式和比例
export const paynode = () => {
  return request({
    url: "/api/paynode",
    method: "GET",
  });
};

//支付方式和比例
export const createPayments = (data) => {
  return request({
    url: "/api/payments",
    method: "POST",
    data: data,
  });
};

//获取订单状态
export const checkpayment = (uuid) => {
  return request({
    url: "/api/checkpayment?uuid=" + uuid,
    method: "GET",
  });
};

//获取订单状态
export const completepayment = (data) => {
  return request({
    url: "/api/completepayment",
    method: "POST",
    data: data,
  });
};

//生成交易
export const transactions = (data) => {
  return request({
    url: "/api/oms/transactions",
    method: "POST",
    data: data,
  });
};

//refreshToken
export const refreshToken = () => {
  return request({
    url: "/api/accounts/refresh_token",
    method: "POST",
  });
};

//⽂件LIST
export const oodFileList = (orderId, peerId, prefix) => {
  let url = "/list_files",
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
    Id: orderId,
    peerId,
  };

  return request({
    url: url,
    method: "POST",
    data,
  });
};


export const find_objects = (orderId, peerId, fileId) => {
  let url = "/find_objects",
    prefix = "",
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
    Id: orderId,
    peerId,
    fileId,
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
//⽂件STATUS
export const oodFileStatus = (ID, type) => {
  let url = `/stats?st_type=${type}`;
  // let url = '/ping?t=1111';
  return request({
    url: url,
    method: "GET",
  });
};


export const file_delete = (item,peerId, Id) => {
  let objects = [
    { pubkey: item.pubkey ? item.pubkey : encodeURIComponent(item.key) },
  ];
  let cids = [item.cid];
  let object_type = item.type;
  let url = `/file_delete`;
  let data = {
    Id,
    peerId,
    cids,
    objects,
    object_type,
  };
  return request({
    url: url,
    method: "DELETE",
    data,
  });
};


//⽂件Search
export const oodFileSearch = (key) => {
  // let url = `/o/${ID}/find?key=${key}`;
  let url = `/find?key=${key}`;
  return request({
    url: url,
    method: "GET",
  });
};

//监控信息
export const oodMonitor = (item) => {
  let url = `/metrics/Info?size=${item.size}&field_value=${item.field_value}&miner_ids=${item.miner_ids}&metrics_type=${item.metrics_type}&by_date=${item.date}`;
  return request({
    url: url,
    method: "GET",
  });
};


//VOOD总容量和健康度信息获取
export const getActivationVood = (data, target) => {
  let url = `/v1/get_service_info`;
  return request({
    url: url,
    method: "GET",
    target,
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
  let url = `/publish`;
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


//检查VOOD的信息
export const voodInfoCheck = (vpsId) => {
  return request({
    url: `/v1/service/check_cyfs`,
    method: "GET",
  });
};

//激活VOOD
export const voodActivate = (data) => {
  return request({
    url: `/api/vps/vood_activate`,
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
 * @param {String} fileName 文件名称
 * @param {String} upload_id 创建时不需要传入,上传完成时需要传入
 * @param {String} cid  文件唯一表示
 * @param {object} data  创建时不需要传入,上传完成时需要传入格式为  parts:[{"part_number":1,"etag":"60f3efd9111f7a19c23d6045b15e8a2b"}]
 * @param {String} fileType  文件类型 this.file.fileType
 *  */
/* 大文件 上传 开始上传/上传结束 */
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


//文件分享
export const fileShare = (ood_id, data) => {
  let url = `o/${ood_id}/presignurl`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};


//002  获取当前任务的状态
export const awardTaskList = (ood_id) => {
  if (ood_id && ood_id !== null) {
    return request({
      url: `/x/tasklist?ood_id=${ood_id}`,
      method: "GET",
    });
  }
};

//003  完成任务
export const finishTask = (data) => {
  return request({
    url: "/x/reward_active",
    method: "POST",
    data: data,
  });
};

//004  领取奖励
export const rewardReceive = (data) => {
  return request({
    url: "/x/reward_receive",
    method: "POST",
    data: data,
  });
};

//005 查看昨⽇奖励
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

//006 获取ood 历史获取奖励
export const historyReward = (ID, page, limit) => {
  if (ID && ID !== null) {
    let url = `/x/${ID}/reward?page=${page}&limit=${limit}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//007 获取单个keyfile信息
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


//获取account 最近7天奖励
export const lastweekReward = (account) => {
  if (account && account !== null) {
    let url = `/x/lastweek_reward?owner_id=${account}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//获取⽂件分享 最近7天统计信息
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

//获取otp的secret和qrcode
export const getWithdrawGoogle = (data) => {
  return request({
    url: "/x/otp",
    method: "POST",
    data: data,
  });
};

//验证google验证
export const verifyGoogle = (data) => {
  return request({
    url: "/x/verify_otp",
    method: "POST",
    data: data,
  });
};
//开启google验证
export const withdrawGoogle = (data) => {
  return request({
    url: "/x/withdraw_otp",
    method: "POST",
    data: data,
  });
};

// cbs服务激活
export const deploy_cbs = (target) => {
  return request({
    url: `/v1/service/deploy_cbs`,
    method: "POST",
    target,
  });
};
// ipfs服务激活
export const deploy_ipfs = (target) => {
  return request({
    url: `/v1/service/deploy_ipfs`,
    method: "POST",
    target,
  });
};
// cyfs服务激活
export const deploy_cyfs = (data, target) => {
  return request({
    url: `/v1/service/deploy_cyfs`,
    method: "POST",
    data,
    target,
  });
};
// 服务状态查询
export const get_service_info = (target) => {
  return request({
    url: `/v1/get_service_info`,
    method: "get",
    target, //{ip,device_id}
  });
};

// 探测绑定的 foggie 账户 DMC 信息
export const get_foggie_dmc = (data) => {
  return request({
    url: `/api/accounts/get_foggie_dmc`,
    method: "POST",
    data,
  });
};
//  绑定/注册 foggie 账户
export const bind_foggie = (data, target) => {
  return request({
    url: `/v1/account/bind_foggie`,
    method: "POST",
    data,
    target,
  });
};
//  解绑 foggie 账户
export const unbind_foggie = (target) => {
  return request({
    url: `/v1/account/unbind_foggie`,
    method: "POST",
    target,
  });
};

//  搜索设备
export const search_foggie = (data) => {
  return request({
    url: `/api/accounts/search_foggie`,
    method: "POST",
    data,
  });
};
//开启主网账号验证
export const checkAccount = (data, target = {}) => {
  return request({
    url: "/v1/chain/get_account",
    method: "POST",
    data,
    target,
  });
};
// 修改访问密码
export const modify_access_password = (data, target) => {
  return request({
    url: `/v1/account/modify_access_password`,
    method: "POST",
    data,
    target,
  });
};
// 访问密码是否存在监测
export const check_access_pass = (target) => {
  return request({
    url: `/v1/account/check_access_pass`,
    method: "GET",
    target,
  });
};
// 访问密码设置
export const access_pass = (data, target) => {
  return request({
    url: `/v1/account/access_pass`,
    method: "POST",
    data,
    target,
  });
};
// 访问密码登录
export const access_pass_login = (data, target) => {
  return request({
    url: `/v1/account/access_pass_login`,
    method: "POST",
    data,
    target,
  });
};
// IPFS 服务开启/关闭
export const op_ipfs = (data, target) => {
  return request({
    url: `/v1/service/op_ipfs`,
    method: "POST",
    data,
    target,
  });
};
// cyFS 服务开启/关闭
export const op_cyfs = (data, target) => {
  return request({
    url: `/v1/service/op_cyfs`,
    method: "POST",
    data,
    target,
  });
};
// 服务一键重置
export const reset_vood = (target) => {
  return request({
    url: `/v1/service/reset_vood`,
    method: "POST",
    target,
  });
};
//  探测设备是否可以外网访问
export const detected_net = (target) => {
  return request({
    url: `/v1/detected_net`,
    method: "GET",
    target,
  });
};

//getIP
export const getIP = () => {
  let url = `/getIP`;
  return request({
    url: url,
    method: "GET",
  });
};

//portalPing
export const portalPing = (data) => {
  let url = "/portal_ping";
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

//socket_ip
export const socketIP = (data) => {
  let url = "/socket_ip";
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

//ping_url
export const pingUrl = (data) => {
  let url = "/get_max_info";
  return request({
    url: url,
    method: "POST",
    data,
  });
};

//get_net_status
export const getNetStatus = (data) => {
  let url = `/get_net_status`;
  return request({
    url: url,
    method: "POST",
    data,
  });
};



export const search_object = (data) => {
  let url = `/search_object`;
  return request({
    url: url,
    method: "POST",
    data,
  });
};


