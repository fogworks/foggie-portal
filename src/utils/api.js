import request from "@/utils/request";
// import axios from "axios";
// const https = require('https-agent')

//  产品列表
export const getProduct = () => {
  return request({
    url: "/api/pms/product", //后端对应的接口,如果前端配置了跨域，这里直接写http://xx:xx后面的内容
    method: "get", //请求的方式，get,post等
    data: "", //请求所带的参数
  });
};

//创建订单
export const addOrder = (data) => {
  return request({
    url: "/api/oms/order",
    method: "post",
    data: data,
  });
};

// 删除订单
export const delOrder = (ID) => {
  return request({
    url: "/api/oms/order/" + ID,
    method: "DELETE",
  });
};

//获取所有订单
export const getOrderList = () => {
  return request({
    url: "/api/oms/order",
    method: "get",
  });
};

//获取所有订单111
export const userOrderList = () => {
  return request({
    url: "/api/oms/user_order",
    method: "GET",
  });
};

//获取单个订单
export const getOrder = (ID) => {
  return request({
    url: "/api/oms/order/" + ID,
    method: "get",
    data: "",
  });
};

// 取消订单
export const cancelOrder = (data) => {
  return request({
    url: "/api/oms/order_cancel",
    method: "POST",
    data: data,
  });
};

// 开通订单
export const openOrder = (data) => {
  return request({
    url: "/api/oms/order_start",
    method: "POST",
    data: data,
  });
};

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
//忘记密码
export const forgetPassword = (data) => {
  return request({
    url: "/api/accounts/forget_password",
    method: "POST",
    data: data,
  });
};
// 用户信息
export const user = () => {
  return request({
    url: "/api/accounts/info",
    method: "GET",
  });
};

// 更新用户
export const updateUser = (id, data) => {
  return request({
    url: "/api/accounts/user/" + id,
    method: "PUT",
    data: data,
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

//用户操作日志信息获取
export const getLog = (data) => {
  if (data.id) {
    return request({
      url: `/api/events/user_event_log?pn=${data.pn}&ps=${data.ps}&order_id=${data.id}`,
      method: "GET",
    });
  } else {
    return request({
      url: `/api/events/user_event_log?pn=${data.pn}&ps=${data.ps}`,
      method: "GET",
    });
  }
};

//重启VPS
export const reboot = (data) => {
  return request({
    url: "/api/vps/reboot",
    method: "POST",
    data: data,
  });
};

//获取激活OOD的二维码
export const oodActive = (data) => {
  return request({
    url: "/api/vps/ood_active",
    method: "POST",
    data: data,
  });
};

//全部工单查询
export const getTicket = (data) => {
  return request({
    // url:`/api/tms/ticket`,
    url: `/api/tms/user_ticket?pn=${data.pn}&ps=${data.ps}`,
    method: "GET",
  });
};

//指定订单工单查询
export const getOrderTicket = (data) => {
  return request({
    url: `/api/tms/order_ticket?pn=${data.pn}&ps=${data.ps}`,
    method: "POST",
    data: { order_id: data.order_id },
  });
};

//创建工单
export const addTicket = (data) => {
  return request({
    url: `/api/tms/ticket`,
    method: "POST",
    data: data,
  });
};
//删除工单
export const delTicket = (ID) => {
  return request({
    url: `/api/tms/ticket/` + ID,
    method: "DELETE",
  });
};

//工单添加备注
export const addTicketNote = (data) => {
  return request({
    url: `/api/tms/add_note`,
    method: "POST",
    data: data,
  });
};

//工单信息更新
export const updateTicket = (ID, data) => {
  return request({
    url: `/api/tms/ticket/` + ID,
    method: "PUT",
    data: data,
  });
};

//订单续费
export const orderRecharge = (data) => {
  return request({
    url: "/api/oms/order_renewal",
    method: "POST",
    data: data,
  });
};

//获取告警数据条目
export const getAlarm = (data) => {
  return request({
    // url: "/api/alarm/info",
    url: `/api/alarm/user_info?pn=${data.pn}&ps=${data.ps}`,
    method: "GET",
  });
};

//指定订单告警信息
export const getAlarmID = (data, postData) => {
  return request({
    url: `/api/alarm/order_alarm?pn=${data.pn}&ps=${data.ps}`,
    method: "POST",
    data: postData,
  });
};

//硬件监控数据获取
export const getHardware = (data) => {
  let url = "";
  if (data.size) {
    url = `/api/alarm/hardware?size=${data.size}&field_value=${data.field_value}&only_host=${data.only_host}&ips=${data.ips}`;
  } else {
    url = `/api/alarm/hardware?by_date=${data.by_date}&field_value=${data.field_value}&only_host=${data.only_host}&ips=${data.ips}`;
  }
  return request({
    url: url,
    method: "GET",
  });
};

//硬件监控数据获取
export const getHardwareIP = (data) => {
  let url = "";
  if (data.size) {
    url = `/api/alarm/hardware?size=${data.size}&field_value=${data.field_value}&only_host=${data.only_host}&ips=${data.ips}`;
  } else {
    url = `/api/alarm/hardware?by_date=${data.by_date}&field_value=${data.field_value}&only_host=${data.only_host}&ips=${data.ips}`;
  }
  return request({
    url: url,
    method: "GET",
  });
};

//获取单个订单、订单编号
export const getOrderSn = (ID, type) => {
  let url = "/api/oms/user_order_search?order_sn=" + ID;
  if (type === "ip") {
    url = "/api/oms/user_order_search?vps_ip=" + ID;
  }
  return request({
    url: url,
    method: "get",
    data: "",
  });
};

//配置VPS 监控转发
export const monitorConf = (data) => {
  return request({
    url: "/api/vps/monitor_conf",
    method: "POST",
    data: data,
  });
};

//开启/关闭VPS监控
export const monitorAgent = (data) => {
  return request({
    url: "/api/vps/monitor_agent",
    method: "POST",
    data: data,
  });
};

//查看VPS监控配置（指定VPS）
export const getMonitorConf = (data) => {
  return request({
    url: "/api/vps/get_monitor_conf",
    method: "POST",
    data: data,
  });
};

//查看VPS监控配置（全部）
export const monitorConfList = () => {
  return request({
    url: "/api/vps/monitor_conf",
    method: "GET",
  });
};

//登录验证码获取
export const Captcha = () => {
  return request({
    url: "/api/accounts/captcha",
    method: "GET",
  });
};

//邮箱登录
export const emailLogin = (data) => {
  return request({
    url: "/api/accounts/email_login",
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

//确认支付
export const payCallBack = (data, ID) => {
  return request({
    url: "/api/oms/pay_callback/" + ID,
    method: "POST",
    data: data,
  });
};

//获取所有订单page
export const userOrderListPage = (data) => {
  return request({
    url: `/api/oms/user_order?pn=${data.pn}&ps=${data.ps}`,
    method: "GET",
  });
};

//全部订单数目查询
export const userOrderCount = () => {
  return request({
    url: `/api/oms/user_order_count`,
    method: "GET",
  });
};

//当前用户订单信息检索（订单状态检索）
export const userOrderStatus = (data) => {
  return request({
    url: `/api/oms/user_order_search_state?order_state=${data.status}&pn=${data.pn}&ps=${data.ps}`,
    method: "GET",
  });
};

//确认支付
export const payStripe = (data) => {
  return request({
    url: "/api/oms/stripe_pay",
    method: "POST",
    data: data,
  });
};
export const oodFileListByDir = (ID, prefix) => {
  let url = `/o/${ID}/nixls?prefix=${prefix}`; //&delimiter=/
  return request({
    url: url,
    method: "GET",
  });
};
//⽂件LIST
export const oodFileList = (next_marker, prefix) => {
  // let url = scroll ? `/o/${ID}/list?scroll=${scroll}` : `/o/${ID}/list`;
  // let url = prefix ? `/o/${ID}/nixls?prefix=${prefix} ` : `/o/${ID}/nixls`;
  let url = "";
  if (prefix.length > 0) {
    url = `/nixls?prefix=${prefix}&forward=true&delimiter=/`; //&delimiter=/
    // if (scroll) {
    //   url = `/${url}&scroll=${scroll}`;
    // }
    if (next_marker) {
      url = `${url}&marker=${next_marker}&delimiter=/`;
    }
  } else {
    // url = scroll ? `/o/${ID}/nixls?scroll=${scroll}` : `/o/${ID}/nixls`;
    url = next_marker
      ? `/nixls?forward=true&marker=${next_marker}&delimiter=/`
      : `/nixls?forward=true&delimiter=/`;
  }

  return request({
    url: url,
    method: "GET",
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

//⽂件Delete
export const oodFileDel = (ID, item) => {
  let pubkey = item.pubkey
    ? `pubkey=${item.pubkey}`
    : `key=${encodeURIComponent(item.key)}`;
  // let url = `/o/${ID}/${pubkey}`;
  let url = `/object?${pubkey}`;
  return request({
    url: url,
    method: "DELETE",
  });
};

//⽂件oodFileUpload
export const oodFileUpload = (data, ID) => {
  return request({
    // url: `/o/${ID}/object`,
    url: `/object`,
    method: "POST",
    data: data,
  });
};

//dmc
export const dmcRows = (data) => {
  return request({
    url: `/v1/chain/get_table_rows`,
    method: "POST",
    data: data,
  });
};

//⽂件Search
export const oodFileSearch = (ID, key) => {
  // let url = `/o/${ID}/find?key=${key}`;
  let url = `/find?key=${key}`;
  return request({
    url: url,
    method: "GET",
  });
};

//获取vood 昨天收益
export const oodScore = (ID) => {
  if (ID && ID !== null) {
    let url = `/x/yda_score?ood_id=${ID}`;
    // let url = `/x/tda_reward?ood_id=${ID}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//accoun 昨天收益
export const oodAccountScore = (account) => {
  if (account && account !== null) {
    let url = `/x/yda_score?owner_id=${account}`;
    // let url = `/x/tda_reward?owner_id=${account}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//ood 获取ood 历史获取奖励
export const oodHistorytScore = (ID, page, limit) => {
  let url = `/x/${ID}/score?page=${page}&limit=${limit}`;
  return request({
    url: url,
    method: "GET",
  });
};

//获取account下，昨⽇收益top10
export const oodTop = (account) => {
  if (account && account !== null) {
    let url = `/x/yda_score_top_ten?owner_id=${account}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//dmc
export const dmcBind = (data) => {
  return request({
    url: `/x/register`,
    method: "POST",
    data: data,
  });
};

//dmc接触绑定
export const dmcFreeRegister = (data) => {
  return request({
    url: `/x/freeregister`,
    method: "POST",
    data: data,
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

//查询近⼏⽇，账户每⽇收⼊和总计
export const dmcQuery = (data) => {
  return request({
    url: `q/query`,
    method: "POST",
    data: data,
  });
};

//获取account下，获取这个账户下的总空间大小
export const oodTotalSize = (account) => {
  if (account && account !== null) {
    let url = `/x/store?owner_id=${account}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//VOOD总容量和健康度信息获取
export const oodhealthVood = () => {
  let url = `/api/vps/get_health_vood`;
  return request({
    url: url,
    method: "GET",
  });
};

//VOOD总容量和健康度信息获取
export const getActivationVood = (data) => {
  let url = `/api/vps/get_activation_vood?pn=${data.pn}&ps=${data.ps}`;
  return request({
    url: url,
    method: "GET",
  });
};

//更新绑定/解绑VOOD的DMC账户
export const updateVoodDmc = (data) => {
  return request({
    url: `/api/vps/update_vood_dmc_bind`,
    method: "POST",
    data: data,
  });
};

//ipns publish list
export const getIPNSList = (ID) => {
  let url = `ipns/${ID}/publish/scheduler/list`;
  return request({
    url: url,
    method: "GET",
  });
};

//ipfs local list
export const getIPFSLocalList = (ID) => {
  // let url = `ipfsops/${ID}/local/list`;
  let url = `/ipfsops/local/list`;
  return request({
    url: url,
    method: "GET",
  });
};

//ipfs pin list
export const getIPFSPINList = (ID) => {
  let url = `ipfsops/${ID}/pin/list`;
  return request({
    url: url,
    method: "GET",
  });
};

//ipns publish list
export const pIN = (ood_id, data) => {
  // let url = `ipfsops/${ood_id}/pin`;
  let url = `/ipfsops/pin`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};
//ipns publish list
export const dirPIN = (ood_id, data) => {
  let url = `ipfsops/${ood_id}/dirpath/pin`;
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

//ipns publish list
export const IPFSPublish = (ood_id, data) => {
  // let url = `ipns/${ood_id}/publish`;
  let url = `/ipns/publish`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

export const IPFSDownload = (ood_id, cid) => {
  let url = `ipns/${ood_id}/${cid}`;
  return request({
    url: url,
    method: "GET",
  });
};

export const IPFSDelete = (ood_id, cid) => {
  let url = `ipns/${ood_id}/publish/scheduler/${cid}`;
  return request({
    url: url,
    method: "DELETE",
  });
};

export const IPFSPinDelete = (ood_id, cid) => {
  let url = `ipfsops/${ood_id}/pin/${cid}`;
  return request({
    url: url,
    method: "DELETE",
  });
};

//获取vood 昨天收益
export const oodWeekScore = (ID) => {
  if (ID && ID !== null) {
    let url = `/x/lastweek_score?owner_id=${ID}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//更新绑定/解绑VOOD的DMC账户
export const updateVoodGateway = (data) => {
  return request({
    url: `/api/vps/deploy_vood_gateway`,
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

export const githubReq = (state) => {
  return request({
    url: state
      ? `api/accounts/oauth/github_url?state=${state}`
      : "api/accounts/oauth/github_url",
    method: "GET",
  });
};

// 获取account/ood下，当前挂单信息⼤⼩
export const OODBills = (ID) => {
  if (ID && ID !== null) {
    let url = `/x/bills?ood_id=${ID}`;
    return request({
      url: url,
      method: "GET",
    });
  }
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

/* 小文件上传 */
export const postUpload = (url, data, controller, callback) => {
  return request({
    url: url,
    method: "POST",
    data: data,

    "Content-Type": "multipart/form-data",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    signal: controller.signal,
    onUploadProgress: function (progressEvent) {
      //原生获取上传进度的事件
      if (progressEvent.lengthComputable) {
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        callback(progressEvent);
      }
    },

    // httpsAgent: new https.Agent({
    //   rejectUnauthorized: false
    // }),
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

  url = `/mp/${encodeURIComponent(fileName)}?upload_id=${
    upload_id ?? ""
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

/**
 * @param {String} fileName 文件名称
 * @param {String} upload_id 创建时不需要传入,上传完成时需要传入
 *  */

/* 大文件 断点续传 查看文件当前上传到第几段 */
export const curUploadChunk = (params) => {
  return request({
    url: `/mp/${encodeURIComponent(params.fileName)}?upload_id=${
      params.upload_id
    }`,
    method: "GET",
    data: data,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};

/* 大文件 切片上传接口  */
export const UploadChunkFile = (params, data, controller, callback) => {
  let url = "";
  // if (params.isGateway) {
  //   url = `https://${params.device_id}.${process.env.VUE_APP_UPLOAD_URL}/mp/${params.fileName}?upload_id=${params.upload_id}&part_number=${params.part_number}`;
  // } else {
  //   url = `/o/${params.device_id}/mp/${params.fileName}?upload_id=${params.upload_id}&part_number=${params.part_number}`;
  // }
  url = `/mp/${params.fileName}?upload_id=${params.upload_id}&part_number=${params.part_number}`;

  return request({
    // url: `https://${params.device_id}.us.devlop.fogworks.io/mp/${params.fileName}?upload_id=${params.upload_id}&part_number=${params.part_number}`,
    url: url,
    // url: `https://${params.dedicatedip}/mp/${params.fileName}?upload_id=${params.upload_id}&part_number=${params.part_number}`,
    method: "PUT",
    data: data,
    MD5: params.MD5,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    signal: controller.signal,
    onUploadProgress: function (progressEvent) {
      //原生获取上传进度的事件
      if (progressEvent.event.lengthComputable) {
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        callback(progressEvent.event, params.part_number);
      }
    },
  });
};

/* 文件取消上传  */
export const UploadDeleteFile = (params) => {
  let url = "";
  // if (params.isGateway) {
  //   url = `https://${params.device_id}.${process.env.VUE_APP_UPLOAD_URL}/mp/${params.fileName}?upload_id=${params.upload_id}`;
  // } else {
  //   url = `/o/${params.device_id}/mp/${params.fileName}?upload_id=${params.upload_id}`;
  // }
  url = `/mp/${params.fileName}?upload_id=${params.upload_id}`;
  return request({
    url: url,
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};

/* 查看客户端版本   */
export const UploadLookVersion = (device_id, flag) => {
  let obj = {
    url: "",
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  obj.url = `/ping`;

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

// get DiD
export const getDiD = () => {
  let url = `/api/accounts/did`;
  return request({
    url: url,
    method: "GET",
  });
};

// create DiD
export const createDiD = () => {
  let url = `/api/accounts/did`;
  return request({
    url: url,
    method: "POST",
  });
};

// 设置密码关闭，以及设置VOOD点击NEXT关闭
export const globalConfig = (data) => {
  let url = `/api/accounts/global_config`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};
// DID发邮件
export const didEmail = (data) => {
  let url = `/api/accounts/did_email`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

// 助记词更新接口
export const didUpdate = (data) => {
  let url = `/api/accounts/update_recovery_phrase`;
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

// 获取升级信息
export const getUpdateInfo = () => {
  return request({
    url: "/api/vps/get_activation_vood",
    method: "GET",
  });
};

// 升级VOOD网关服务
export const upgradeVoodGateway = (data) => {
  return request({
    url: "/api/vps/upgrade_vood_gateway",
    method: "POST",
    data: data,
  });
};

// 获取消息
export const getNotice = () => {
  return request({
    url: "/api/accounts/get_notice",
    method: "GET",
  });
};

// 获取库存
export const productStock = (id) => {
  let url = `/api/pms/product_stock?product_id=${id}`;
  return request({
    url: url,
    method: "GET",
  });
};

// 产品登录
export const productLogin = (data) => {
  return request({
    url: "/api/accounts/product_login",
    method: "POST",
    data: data,
    "Content-Type": "application/x-www-form-urlencoded",
  });
};

// 创建DMC账户接口
export const DMCAccountCreate = (token) => {
  let url = "/cyfs_sign/create_signature_identity/default";
  return request({
    url: url,
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
};

// VOOD重置
export const resetVood = (data) => {
  return request({
    url: "/api/vps/reset_vood",
    method: "POST",
    data: data,
  });
};

//奖励
//001  初次绑定，上传1个⽂件⼤于1kb。 上传4G⽂件
export const bindtask = (data) => {
  return request({
    url: "/x/bindtask",
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
//008 生成邀请码
export const generateCodeApi = () => {
  let url = `api/accounts/get_referral_code`;
  return request({
    url: url,
    method: "GET",
  });
};

// 获取当前汇率
export const getExchangeRate = (type) => {
  return request({
    url: `/vpp/api/tools/get_exchange_rate?exchange_rate_type=${type}`,
    method: "GET",
  });
};

// 收款资源池查询
export const getWalletAccounts = () => {
  return request({
    url: "/vpp/api/ams/wallet_accounts",
    method: "GET",
  });
};

// 交易记录生成
export const orderTransaction = (data) => {
  return request({
    url: "/vpp/api/tms/order_transaction",
    method: "POST",
    data: data,
  });
};

// 交易信息查询
export const getOrderTransaction = (order_id, transaction_id) => {
  return request({
    url:
      "/vpp/api/tms/order_transaction?order_id=" +
      order_id +
      "&transaction_id=" +
      transaction_id,
    method: "GET",
  });
};

// 判断邮箱是否注册
export const check_email_register = (email) => {
  return request({
    url: "/api/accounts/check_email_register?email=" + email,
    method: "GET",
  });
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

// 当前用户的全部VPS流量信息
export const getTotalFlow = () => {
  return request({
    url: "/api/vps/get_user_vps_net_stat",
    method: "GET",
  });
};

// 查询当月流量
export const getMonthFlow = () => {
  return request({
    url: "/api/vps/get_user_vps_net_stat_month",
    method: "GET",
  });
};

// 激活前更新peope_id、status
export const updatePeopleInfo = (data) => {
  return request({
    url: "/api/accounts/people_info",
    method: "POST",
    data: data,
  });
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

// 邀请码获取下线数目/下线购买数目
export const geCodeUsed = (code) => {
  if (code) {
    let url = `/api/accounts/get_referral_code_used?referral_code=${code}`;
    return request({
      url: url,
      method: "GET",
    });
  }
};

//002  总奖励数
export const totalReward = (owner_id) => {
  if (owner_id && owner_id !== null) {
    return request({
      url: `/x/reward?owner_id=${owner_id}`,
      method: "GET",
    });
  }
};

export const sourceReward = (owner_id) => {
  if (owner_id && owner_id !== null) {
    return request({
      url: `/x/reward?owner_id=${owner_id}&source=share`,
      method: "GET",
    });
  }
};

//开启主网账号验证
export const checkAccount = (data) => {
  return request({
    url: "/v1/chain/get_account",
    method: "POST",
    data: data,
  });
};

//取消交易(支付系统取消)
export const paymentCancel = (data) => {
  return request({
    url: "/vpp/api/tms/update_transaction_cancel?uuid=" + data.uuid,
    method: "POST",
    // data: data,
  });
};

//取消交易(订单系统取消)
export const orderCancel = (data) => {
  return request({
    url:
      "/api/oms/update_transaction_cancel?transaction_id=" +
      data.transaction_id +
      "&uuid=" +
      data.uuid,
    method: "POST",
    // data: data,
  });
};

// 用户优惠码校验
export const check_coupon_number = (coupon_num) => {
  if (coupon_num && coupon_num !== null) {
    return request({
      url: `/api/coupon/check_coupon_number?coupon_number=${coupon_num}`,
      method: "GET",
    });
  }
};

//部署CYFS
export const deployCYFS = (data) => {
  return request({
    url: "/api/vps/deploy_cyfs",
    method: "POST",
    data: data,
  });
};

// 部署CBS/IPFS
export const deployVoodGateway = (data) => {
  return request({
    url: "/api/vps/deploy_vood_gateway",
    method: "POST",
    data: data,
  });
};

// 开启/关闭CYFS服务
export const operCyfsService = (data) => {
  return request({
    url: "/api/vps/oper_cyfs_service",
    method: "POST",
    data: data,
  });
};

// 开启/关闭IPFS服务
export const operIpfsService = (data) => {
  return request({
    url: "/api/vps/oper_ipfs_service",
    method: "POST",
    data: data,
  });
};

// CYFS 重置
export const resetCyfs = (data) => {
  return request({
    url: "/api/vps/reset_cyfs",
    method: "POST",
    data: data,
  });
};

// IPFS重置
export const resetIpfs = (data) => {
  return request({
    url: "/api/vps/reset_ipfs",
    method: "POST",
    data: data,
  });
};

//cyfs pin
export const cyfsPINList = (device_id, object, pubkey) => {
  object = encodeURIComponent(object);
  // let url = `/o/${device_id}/pin/${object}?pubkey=${pubkey}`;
  let url = `/pin/${object}?pubkey=${pubkey}`;
  return request({
    url: url,
    method: "POST",
  });
};

//authorize支付
export const authorize_net_pay = (data) => {
  let url = "/api/oms/authorize_net_pay";
  return request({
    url: url,
    method: "POST",
    data: data,
  });
};

// 获取当前用户是否存在付费订单
export const get_user_all_buy_count = () => {
  return request({
    url: `/api/oms/get_user_all_buy_count`,
    method: "GET",
  });
};

// 获取当前用户是否开通过订单
export const get_user_all_active_order = () => {
  return request({
    url: `/api/oms/get_user_all_active_order`,
    method: "GET",
  });
};

// 获取套件安装状态
export const get_kit_installation_status = (params) => {
  return request({
    url: `/api/oms/get_kit_installation_status`,
    method: "GET",
    params,
  });
};

// 管理员注册
export const adminRegister = (data) => {
  return request({
    url: `/v1/account/register`,
    method: "POST",
    data,
  });
};
// 管理员登录
export const adminLogin = (data) => {
  return request({
    url: `/v1/account/login`,
    method: "POST",
    data,
  });
};
// 管理员修改密码
export const modifyPassword = (id) => {
  return request({
    url: `/v1/account/modifyPassword/${id}`,
    method: "PUT",
  });
};
// cbs服务激活
export const deploy_cbs = (data) => {
  return request({
    url: `/v1/service/deploy_cbs`,
    method: "POST",
    data,
  });
};
// ipfs服务激活
export const deploy_ipfs = (data) => {
  return request({
    url: `/v1/service/deploy_ipfs`,
    method: "POST",
    data,
  });
};
// cyfs服务激活
export const deploy_cyfs = (data) => {
  return request({
    url: `/v1/service/deploy_cyfs`,
    method: "POST",
    data,
  });
};
// 服务状态查询
export const get_service_info = () => {
  return request({
    url: `/v1/get_service_info`,
    method: "get",
  });
};

// 探测绑定的 foggie 账户 DMC 信息
export const get_foggie_dmc = (data) => {
  return request({
    url: `/api/accounts/get_foggie_dmc`,
    method: "POST",
    data
  });
};
//  绑定/注册 foggie 账户
export const bind_foggie = (data) => {
  return request({
    url: `/v1/account/bind_foggie`,
    method: "POST",
    data
  });
};
//  解绑 foggie 账户
export const unbind_foggie = () => {
  return request({
    url: `/v1/account/unbind_foggie`,
    method: "POST",
  });
};

//  搜索设备
export const search_foggie = (data) => {
  return request({
    url: `/api/accounts/search_foggie`,
    method: "POST",
    data
  });
};

// 修改访问密码
export const modify_access_password = (data) => {
  return request({
    url: `/v1/account/modify_access_password`,
    method: "POST",
    data
  });
};
// 访问密码是否存在监测
export const check_access_pass = () => {
  return request({
    url: `/v1/account/check_access_pass`,
    method: "GET",
  });
};
// 访问密码设置
export const access_pass = (data) => {
  return request({
    url: `/v1/account/access_pass`,
    method: "POST",
    data
  });
};
// 访问密码登录
export const access_pass_login = (data) => {
  return request({
    url: `/v1/account/access_pass_login`,
    method: "POST",
    data
  });
};
// IPFS 服务开启/关闭
export const op_ipfs = (data) => {
  return request({
    url: `/v1/service/op_ipfs`,
    method: "POST",
    data
  });
};
// cyFS 服务开启/关闭
export const op_cyfs = (data) => {
  return request({
    url: `/v1/service/op_cyfs`,
    method: "POST",
    data
  });
};
// 服务一键重置
export const reset_vood = () => {
  return request({
    url: `/v1/service/reset_vood`,
    method: "POST",
  });
};
//  探测设备是否可以外网访问
export const detected_net = () => {
  return request({
    url: `/v1/detected_net`,
    method: "GET",
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
