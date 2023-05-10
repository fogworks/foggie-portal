var CryptoJS = require("crypto-js");
function decrypt(value) {
  var crypt_key = "047ADGJMQTW0369D";
  var crypt_iv = "131b0c8a7a6e072e";
  let aes_key = CryptoJS.enc.Utf8.parse(crypt_key);
  let aes_iv = CryptoJS.enc.Utf8.parse(crypt_iv);
  let baseResult = CryptoJS.enc.Base64.parse(value);
  let ciphertext = CryptoJS.enc.Base64.stringify(baseResult);
  let decryptResult = CryptoJS.AES.decrypt(ciphertext, aes_key, {
    iv: aes_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  let resData = decryptResult.toString(CryptoJS.enc.Utf8).toString();
  return resData;
}

function hmac() {
  // let key = "megaops@2022";
  // let data = "voodKey";
  // var crypto = require("crypto");
  // var hmac = crypto.createHmac("sha1", key);
  // var signed = hmac.update(Buffer.from(data, "utf-8")).digest("base64");
  // signed = signed.replace("/", "_").replace("+", "-");
  // let tokens = {
  //   ApiKey: signed,
  //   Signature: data,
  // };
  // return tokens;
}
function transferTime(utc_datetime) {
  let new_datetime =
    utc_datetime.split("T")[0] + " " + utc_datetime.split("T")[1].split(".")[0];

  let timestamp = new Date(new_datetime.replace(/-/g, "/")).getTime();
  timestamp = timestamp / 1000;
  // timestamp = timestamp + 8 * 60 * 60;

  let date = new Date(parseInt(timestamp) * 1000);
  let YY = date.getFullYear() + "-";
  let MM =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hh =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let mm =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return YY + MM + DD + " " + hh + mm + ss;
}
function handleTimeStamp(timestamp) {
  let date = new Date(parseInt(timestamp) * 1000);
  let YY = date.getFullYear() + "-";
  let MM =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hh =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let mm =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return YY + MM + DD + " " + hh + mm + ss;
}
function handleTime(time) {
  if (time < 0) {
    return;
  }
  var obj = {
    text: "-",
    day: 0,
    isDanger: false,
    s: 0,
    h: 0,
    m: 0,
  };
  if (time < 60) {
    let s = parseInt(time);
    obj.s = s;
    obj.text = `${s}Seconds `;
  } else if (time < 3600) {
    let m = parseInt(time / 60);
    let s = parseInt(time % 60);
    obj.s = s;
    obj.m = m;
    obj.text = `${m}Minutes ${s}Seconds `;
  } else if (time < 86400) {
    let h = parseInt(time / 3600);
    let min = time - h * 3600;
    let m = parseInt(min / 60);
    let ss = min - m * 60;
    let s = parseInt(ss);
    obj.s = s;
    obj.h = h;
    obj.m = m;
    obj.text = `${h}Hours ${m}Minutes ${s}Seconds `;
  } else if (time > 86400) {
    let day = parseInt(time / 86400);
    let hour = time - day * 86400;
    let h = parseInt(hour / 3600);
    let min = hour - h * 3600;
    let m = parseInt(min / 60);
    let ss = min - m * 60;
    let s = parseInt(ss);
    if (day > 7 || (day == 7 && h > 0)) {
      obj.isDanger = false;
    }
    obj.s = s;
    obj.h = h;
    obj.m = m;
    obj.day = day;
    obj.text = `${day}Days ${h}Hours ${m}Minutes ${s}Seconds `;
  }
  return obj;
}
function echartsHandleTimeStamp(timestamp) {
  let date = new Date(parseInt(timestamp));
  let YY = date.getFullYear() + "-";
  let MM =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hh =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return MM + DD + " " + hh + mm;
  // return hh + mm;
}
function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

function getfilesize(size, type) {
  if (!size && size !== 0) return "";
  var num = 1024.0; //byte
  size = Number(size).toFixed(2);
  if (type === "kb") {
    if (size < num) return size + " kB";
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + " MB"; //kb
    if (size < Math.pow(num, 3))
      return (size / Math.pow(num, 2)).toFixed(2) + " GB"; //M
    return (size / Math.pow(num, 3)).toFixed(2) + " TB"; //G
  } else {
    if (size < num) return size + " B";
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + " KB"; //kb
    if (size < Math.pow(num, 3))
      return (size / Math.pow(num, 2)).toFixed(2) + " MB"; //M
    if (size < Math.pow(num, 4))
      return (size / Math.pow(num, 3)).toFixed(2) + " GB"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + " TB"; //T
  }
}

function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode("0x" + p1);
    })
  );
}

export {
  hmac,
  transferTime,
  handleTimeStamp,
  echartsHandleTimeStamp,
  decrypt,
  getQueryString,
  getfilesize,
  b64EncodeUnicode,
};
