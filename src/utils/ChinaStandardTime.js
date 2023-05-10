/* YYYY-MM-DD HH-mm-SS*/
export function ChinaTime1(date) {
  let T = new Date(date);
  let y = T.getFullYear();
  let m = T.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d = T.getDate();
  d = d < 10 ? "0" + d : d;
  let h = T.getHours();
  h = h < 10 ? "0" + h : h;
  let minute = T.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let second = T.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
}
/* YYYY-MM-DD*/

export function ChinaTime2(date) {
  if (date) {
    const T = new Date(date);
    const y = T.getFullYear();
    let m = T.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = T.getDate();
    d = d < 10 ? "0" + d : d;
    return y + "-" + m + "-" + d;
  } else {
    return null;
  }
}
/* HH-MM*/

export function ChinaTime3(date) {
  if (date) {
    const T = new Date(date);
    let h = T.getHours();
    h = h < 10 ? "0" + h : h;
    let minute = T.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    return h + ":" + minute;
  } else {
    return null;
  }
}

/**
 * @param {Number} n
 * @param {String} type  'YYYY-MM-DD HH-MM-SS' //  'YYYY-MM-DD' // 'HH-MM-SS'
 *  */
export function ChinaTime4(n, type) {
  let nowDate = new Date();
  nowDate.setDate(nowDate.getDate() + n);

  if (type == "YYYY-MM-DD HH-MM-SS") {
    nowDate = ChinaTime1(nowDate);
  } else if (type == "YYYY-MM-DD") {
    nowDate = ChinaTime2(nowDate);
  } else if (type == "HH-MM-SS") {
    nowDate = ChinaTime3(nowDate);
  }
  return nowDate;
}

export function transferTime(utc_datetime, tyep = "YYYY-MM-DD hh-mm-ss") {
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
  if (tyep == "YYYY-MM-DD") return YY + MM + DD;
  else if (tyep == "YYYY-MM-DD hh-mm-ss")
    return YY + MM + DD + " " + hh + mm + ss;
}

/**
 * @param {String} date
 * @param {String} createdTime
 *  */
const ONEDAY = 60 * 60 * 24 * 1000; //
const ONEHOURS = 60 * 60 * 1 * 1000;
const ONEMINUTE = 60 * 1 * 1000;

export function getResidueTime(date, createdTime) {
  if (date) {
    let TimeObj = {
      percentage: 0,
      time: {
        D: "",
        H: "",
        M: "",
      },
    };
    const T = new Date(date);
    const CT = new Date(createdTime);
    const Time = +new Date();

    let allTime = T.getTime() - CT.getTime();
    let consumeTime = Time - CT.getTime();
    let residueTime = allTime - consumeTime;

    TimeObj.percentage = ((residueTime / allTime) * 100).toFixed(4) * 1;

    let D = Math.floor(residueTime / ONEDAY);
    let H = Math.floor((residueTime - D * ONEDAY) / ONEHOURS);

    let M = Math.floor((residueTime - D * ONEDAY - H * ONEHOURS) / ONEMINUTE);

    D = D < 10 ? "0" + D : D;
    H = H < 10 ? "0" + H : H;
    M = M < 10 ? "0" + M : M;

    TimeObj.time.D = D;
    TimeObj.time.H = H;
    TimeObj.time.M = M;

    return TimeObj;
  } else {
    return null;
  }
}
