export function secondsToStr(temp) {
  const years = Math.floor(temp / 31536000);
  if (years) {
    return Number(years).toFixed(0) + " year" + numberEnding(years);
  }
  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return Number(days).toFixed(0) + " day" + numberEnding(days);
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return Number(hours).toFixed(0) + " hour" + numberEnding(hours);
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return Number(minutes).toFixed(0) + " minute" + numberEnding(minutes);
  }
  const seconds = temp % 60;
  return Number(seconds).toFixed(0) + " second" + numberEnding(seconds);
  function numberEnding(number) {
    return number > 1 ? "s" : "";
  }


}

export function kebabCase(s) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

