export function secondsToStr(seconds) {
  let hours = Math.floor(seconds / 3600).toFixed(0);
  let minutes = Math.floor((seconds % 3600) / 60).toFixed(0);
  let remainingSeconds = (seconds % 60).toFixed(0)


  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;


  // console.log(hours,'hours');
  // console.log(minutes,'minutes');
  // console.log(remainingSeconds,'remainingSeconds');

  if (hours >= 24) {
    return "- -";
  } else {
    return hours + "：" + minutes + "：" + remainingSeconds
  }



  // const years = Math.floor(temp / 31536000);
  // if (years) {
  //   return Number(years).toFixed(0) + " year" + numberEnding(years);
  // }
  // const days = Math.floor((temp %= 31536000) / 86400);
  // if (days) {
  //   return Number(days).toFixed(0) + " day" + numberEnding(days);
  // }
  // const hours = Math.floor((temp %= 86400) / 3600);
  // if (hours) {
  //   return Number(hours).toFixed(0) + " hour" + numberEnding(hours);
  // }
  // const minutes = Math.floor((temp %= 3600) / 60);
  // if (minutes) {
  //   return Number(minutes).toFixed(0) + " minute" + numberEnding(minutes);
  // }
  // const seconds = temp % 60;
  // return Number(seconds).toFixed(0) + " second" + numberEnding(seconds);
  // function numberEnding(number) {
  //   return number > 1 ? "s" : "";
  // }
}

export function kebabCase(s) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

export function formatSize(size) {
  if (size < 1024) {
    return size.toFixed(0) + ' bytes'
  } else if (size < 1024 * 1024) {
    return (size / 1024.0).toFixed(0) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024.0 / 1024.0).toFixed(1) + ' MB'
  } else {
    return (size / 1024.0 / 1024.0 / 1024.0).toFixed(1) + ' GB'
  }
}

export function generateUniqueId() {
  const timestamp = (new Date()).getTime().toString(16);
  const random = Math.random().toString(16).substring(2);
  return `${timestamp}-${random}`;
}