/* YYYY-MM-DD HH-mm-SS*/
export function ChinaTime1(date) {
  let T = new Date(date)
  let y = T.getFullYear()
  let m = T.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = T.getDate()
  d = d < 10 ? '0' + d : d
  let h = T.getHours()
  h = h < 10 ? '0' + h : h
  let minute = T.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = T.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}
/* YYYY-MM-DD*/

export function ChinaTime2(date) {
  if (date) {
    const T = new Date(date)
    const y = T.getFullYear()
    let m = T.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = T.getDate()
    d = d < 10 ? '0' + d : d
    return y + '-' + m + '-' + d
  } else {
    return null
  }
}
/* HH-MM*/

export function ChinaTime3(date) {
  if (date) {
    const T = new Date(date)
    let h = T.getHours()
    h = h < 10 ? '0' + h : h
    let minute = T.getMinutes()
    minute = minute < 10 ? '0' + minute : minute
    return h + ':' + minute
  } else {
    return null
  }
}

/* 在当前时间下 延后n天 */
/**
 * @param {Number} n 延后n天
 * @param {String} type 想要以什么形式展示 'YYYY-MM-DD HH-MM-SS' //  'YYYY-MM-DD' // 'HH-MM-SS'
 *  */
export function ChinaTime4(n, type) {
  let nowDate = new Date()
  nowDate.setDate(nowDate.getDate() + n)

  if (type == 'YYYY-MM-DD HH-MM-SS') {
    nowDate = ChinaTime1(nowDate)
  } else if (type == 'YYYY-MM-DD') {
    nowDate = ChinaTime2(nowDate)

  } else if (type == 'HH-MM-SS') {
    nowDate = ChinaTime3(nowDate)

  }
  return nowDate
}

/* 把UTC时间格式转换成正常的时间格式 */
export function transferTime(utc_datetime, tyep = 'YYYY-MM-DD hh-mm-ss') {
  // 转为正常的时间格式 年-月-日 时:分:秒
  let new_datetime =
    utc_datetime.split("T")[0] + " " + utc_datetime.split("T")[1].split(".")[0];
  // 处理成为时间戳
  let timestamp = new Date(new_datetime.replace(/-/g, "/")).getTime();
  timestamp = timestamp / 1000;
  // 增加8个小时，北京时间比utc时间多八个时区
  // timestamp = timestamp + 8 * 60 * 60;

  // 时间戳转为时间
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
  if (tyep == 'YYYY-MM-DD') return YY + MM + DD
  else if (tyep == 'YYYY-MM-DD hh-mm-ss') return YY + MM + DD + " " + hh + mm + ss;

}





/* 在当前时间下 获取当前剩余时间百分比 和 剩余天数 小时 分 */
/**
 * @param {String} date 结束时间
 * @param {String} createdTime 开始时间
 *  */
const ONEDAY = 60 * 60 * 24 * 1000  // 一天的时间戳
const ONEHOURS = 60 * 60 * 1 * 1000
const ONEMINUTE = 60 * 1 * 1000

export function getResidueTime(date, createdTime) {
  if (date) {
    let TimeObj = {
      percentage: 0,
      time: {
        D: '',
        H: '',
        M: ''
      }
    }
    const T = new Date(date)
    const CT = new Date(createdTime)
    const Time = + new Date()

    let allTime = T.getTime() - CT.getTime()   //总时间
    let consumeTime = Time - CT.getTime()  // 消耗时间
    let residueTime = allTime - consumeTime // 剩余时间时间戳


    TimeObj.percentage = ((residueTime / allTime) * 100).toFixed(4) * 1

    let D = Math.floor(residueTime / ONEDAY)
    let H = Math.floor((residueTime - D * ONEDAY) / ONEHOURS)

    let M = Math.floor((residueTime - D * ONEDAY - H * ONEHOURS) / ONEMINUTE)

    D = D < 10 ? '0' + D : D
    H = H < 10 ? '0' + H : H
    M = M < 10 ? '0' + M : M

    TimeObj.time.D = D
    TimeObj.time.H = H
    TimeObj.time.M = M


    return TimeObj
  } else {
    return null
  }
}


