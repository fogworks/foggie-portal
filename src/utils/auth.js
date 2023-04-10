// import Cookies from "js-cookie";

const TokenKey = "foggie-token";
const AccessKey = "access_token";
const RefreshKey = "refresh_token";
const firstKey = "is_verified";
const orderKey = "order_data";
const errorKey = "error";

export function getToken() {
  window.localStorage.getItem(TokenKey);
  // return Cookies.get(TokenKey);
}

export function setToken(token) {
  window.localStorage.setItem(TokenKey, token);
  // return Cookies.set(TokenKey, token);
}

export function removeToken() {
  window.localStorage.removeItem(TokenKey);
  window.localStorage.removeItem(RefreshKey);
}

export function getRefresh() {
  return Cookies.get("refresh");
}

export function setRefresh(refresh) {
  return Cookies.set("refresh", refresh);
}
export function removeRefresh() {
  return Cookies.remove("refresh");
}

export function getAccessToken() {
  return Cookies.get(AccessKey);
}
export function getRefreshToken() {
  return Cookies.get(RefreshKey);
}

export function setAccessToken(token) {
  return Cookies.set(AccessKey, token);
}
export function setRefreshToken(token) {
  return Cookies.set(RefreshKey, token);
}

export function removeAccessToken() {
  return Cookies.remove(AccessKey);
}
export function removeRefreshToken() {
  return Cookies.remove(RefreshKey);
}

export function getfirstToken() {
  return Cookies.get(firstKey);
}

export function setfirstToken(token) {
  return Cookies.set(firstKey, token);
}

export function getOrderCookie() {
  return Cookies.get(orderKey);
}

export function removeOrderCookie() {
  return Cookies.remove(orderKey);
}

export function orderErrorCookie() {
  return Cookies.get(errorKey);
}

export function removeOrderErrorCookie() {
  return Cookies.remove(errorKey);
}
