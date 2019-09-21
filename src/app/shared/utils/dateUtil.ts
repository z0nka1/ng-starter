import { isNotNil } from "./utils";

/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-01-02 15:16:06
 * @description:
 */


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 时间格式化
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 实时获取当前时间字符串
 * @param {*} date
 */
export const formatTimeOnly = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

export const formatDate = (date, seperator = '/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join(seperator);
}

/* 获取某一月的总天数 */
export const getDays = (year, month) => {
  year = year || new Date().getFullYear();
  month = month || new Date().getMonth() + 1;
  return new Date(year, month, 0).getDate();
}

/**
 * 计算多少天
 * @param {*} dateStr 日期字符串格式
 */
export const howLong = (dateStr) => {
  if (!isNotNil(dateStr)) {
    return 0;
  }
  let days = 1;
  dateStr = dateStr.replace(/-/g, '/');
  try {
    let time = new Date().getTime() - new Date(dateStr).getTime();
    days = Math.floor(time / 1000 / 60 / 60 / 24);
  } catch (e) { }

  return days > 0 ? days : 1;
}


const orderCancelTime = 15 * 60 * 1000;

export const formatByTimestamp = (timestamp, hasHour) => {
  let second = Math.floor(timestamp / 1000);
  if (second < 1) {
    return '';
  }
  let totalMinutes = Math.floor(second / 60);
  let _second = second % 60;
  let _secondText: string | number = '';
  _secondText = _second >= 10 ? _second : `0${_second}`;
  if (!hasHour) {
    if (totalMinutes === 0) {
      return _secondText;
    }
    let minuteText = totalMinutes >= 10 ? totalMinutes : `0${totalMinutes}`;
    return `${minuteText}:${_secondText}`;
  }
  let hours = Math.floor(totalMinutes / 60);
  let minutes = Math.floor(totalMinutes % 60);
  const hoursText = hours >= 10 ? hours : `0${hours}`;
  const minutesText = minutes >= 10 ? minutes : `0${minutes}`;
  if (hours === 0) {
    return `${minutesText}:${_secondText}`;
  }
  return `${hoursText}:${minutesText}:${_secondText}`;
}


/**
 * 判断是否有必要计时
 * @param {*} submitTime
 */
export const isTimeToCount = (submitTime) => {
  try {
    submitTime = submitTime.replace(/-/g, '/');
    let time = new Date(submitTime).getTime();
    let now = new Date().getTime();
    if ((now - time) > orderCancelTime) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

// 订单15分钟超时(ms)，一开始就倒计时
export const submitTimeCountDown = submitTime => {
  if (!submitTime) {
    return '';
  }
  try {
    submitTime = submitTime.replace(/-/g, '/');
    let time = new Date(submitTime).getTime();
    let now = new Date().getTime();
    if ((now - time) > orderCancelTime) {
      // 已经超过
      return '';
    }
    let count = (time + orderCancelTime) - now;
    // console.log(count)
    return formatByTimestamp(count, true);
  } catch (e) {

  }
}
