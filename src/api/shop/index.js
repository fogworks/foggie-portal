import request from "@/utils/request";

import setting from "@/setting";

const { apiUrl, baseUrl, portNum, centerPoolUrl } = setting;

export const getProduct = () => {
    return request({
        url: apiUrl + "/api/pms/product",
        method: "get",
        data: ""
    });
};
export const addOrder = (data) => {
    return request({
        url: apiUrl + "/api/oms/order",
        method: "post",
        data: data,
    });
};
export const payStripe = (data) => {
    return request({
        url: apiUrl + "/api/oms/stripe_pay",
        method: "POST",
        data: data,
    });
};
export const openOrder = (data) => {
    return request({
        url: apiUrl + "/api/oms/order_start",
        method: "POST",
        data: data,
    });
};
export const createDiD = () => {
    let url = `/api/accounts/did`;
    return request({
        url: apiUrl + url,
        method: "POST",
    });
};

export const getDiD = () => {
    let url = `/api/accounts/did`;
    return request({
        url: apiUrl + url,
        method: "GET",
    });
};
export const globalConfig = (data) => {
    let url = `/api/accounts/global_config`;
    return request({
        url: apiUrl + url,
        method: "POST",
        data: data,
    });
};
export const productStock = (id) => {
    let url = `/api/pms/product_stock?product_id=${id}`;
    return request({
        url: apiUrl + url,
        method: "GET",
    });
};
export const getExchangeRate = (type) => {
    return request({
        url: apiUrl + `/vpp/api/tools/get_exchange_rate?exchange_rate_type=${type}`,
        method: "GET",
    });
};
export const getWalletAccounts = () => {
    return request({
        url: apiUrl + "/vpp/api/ams/wallet_accounts",
        method: "GET",
    });
};
export const transactions = (data) => {
    return request({
        url: apiUrl + "/api/oms/transactions",
        method: "POST",
        data: data,
    });
};
export const orderTransaction = (data) => {
    return request({
        url: apiUrl + "/vpp/api/tms/order_transaction",
        method: "POST",
        data: data,
    });
};
export const getOrderTransaction = (order_id, transaction_id) => {
    return request({
        url: apiUrl +
            "/vpp/api/tms/order_transaction?order_id=" +
            order_id +
            "&transaction_id=" +
            transaction_id,
        method: "GET",
    });
};
export const check_coupon_number = (coupon_num) => {
    if (coupon_num && coupon_num !== null) {
        return request({
            url: apiUrl + `/api/coupon/check_coupon_number?coupon_number=${coupon_num}`,
            method: "GET",
        });
    }
};
export const get_user_all_active_order = () => {
    return request({
        url: apiUrl + `/api/oms/get_user_all_active_order`,
        method: "GET",
    });
};
export const userOrderListPage = (data) => {
    return request({
        url: apiUrl + `/api/oms/user_order?pn=${data.pn}&ps=${data.ps}`,
        method: "GET",
    });
};
export const delOrder = (ID) => {
    return request({
        url: apiUrl + "/api/oms/order/" + ID,
        method: "DELETE",
    });
};
export const cancelOrder = (data) => {
    return request({
        url: apiUrl + "/api/oms/order_cancel",
        method: "POST",
        data: data,
    });
};
export const getOrderSn = (ID, type) => {
    let url = "/api/oms/user_order_search?order_sn=" + ID;
    if (type === "ip") {
        url = "/api/oms/user_order_search?vps_ip=" + ID;
    }
    return request({
        url: apiUrl + url,
        method: "get",
        data: "",
    });
};
export const userOrderCount = () => {
    return request({
        url: apiUrl + `/api/oms/user_order_count`,
        method: "GET",
    });
};
export const userOrderStatus = (data) => {
    return request({
        url: apiUrl + `/api/oms/user_order_search_state?order_state=${data.status}&pn=${data.pn}&ps=${data.ps}`,
        method: "GET",
    });
};
export const oodActive = (data) => {
    return request({
        url: apiUrl + "/api/vps/ood_active",
        method: "POST",
        data: data,
    });
};
export const orderRecharge = (data) => {
    return request({
        url: apiUrl + "/api/oms/order_renewal",
        method: "POST",
        data: data,
    });
};
export const getHardwareIP = (data) => {
    let url = "";
    if (data.size) {
        url = `/api/alarm/hardware?size=${data.size}&field_value=${data.field_value}&only_host=${data.only_host}&ips=${data.ips}`;
    } else {
        url = `/api/alarm/hardware?by_date=${data.by_date}&field_value=${data.field_value}&only_host=${data.only_host}&ips=${data.ips}`;
    }
    return request({
        url: apiUrl + url,
        method: "GET",
    });
};
export const getOrder = (ID) => {
    return request({
        url: apiUrl + "/api/oms/order/" + ID,
        method: "get",
        data: "",
    });
};
export const user = () => {
    return request({
        url: apiUrl + "/api/accounts/info",
        method: "GET",
    });
};
export const didUpdate = (data) => {
    let url = `/api/accounts/update_recovery_phrase`;
    return request({
        url: apiUrl + url,
        method: "POST",
        data: data,
    });
};

export const dmcBind = (data) => {
    return request({
        url: apiUrl + `/x/register`,
        method: "POST",
        data: data,
    });
};
export const updateUser = (id, data) => {
    return request({
        url: apiUrl + "/api/accounts/user/" + id,
        method: "PUT",
        data: data,
    });
};
export const updateVoodDmc = (data) => {
    return request({
        url: apiUrl + `/api/vps/update_vood_dmc_bind`,
        method: "POST",
        data: data,
    });
};
export const updateVoodGateway = (data) => {
    return request({
        url: apiUrl + `/api/vps/deploy_vood_gateway`,
        method: "POST",
        data: data,
    });
};
export const dmcFreeRegister = (data) => {
    return request({
        url: apiUrl + `/x/freeregister`,
        method: "POST",
        data: data,
    });
};
export const DMCAccountCreate = (token) => {
    let url = "/cyfs_sign/create_signature_identity/default";
    return request({
        url: apiUrl + url,
        method: "GET",
        headers: {
            Authorization: token,
        },
    });
};
export const bindtask = (data) => {
    return request({
        url: apiUrl + "/x/bindtask",
        method: "POST",
        data: data,
    });
};
export const updatePeopleInfo = (data) => {
    return request({
        url: apiUrl + "/api/accounts/people_info",
        method: "POST",
        data: data,
    });
};
export const paymentCancel = (data) => {
    return request({
        url: apiUrl + "/vpp/api/tms/update_transaction_cancel?uuid=" + data.uuid,
        method: "POST",
        // data: data,
    });
};
export const orderCancel = (data) => {
    return request({
        url: apiUrl +
            "/api/oms/update_transaction_cancel?transaction_id=" +
            data.transaction_id +
            "&uuid=" +
            data.uuid,
        method: "POST",
        // data: data,
    });
};



