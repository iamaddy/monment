function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimeStr(time) {
    var nt = new Date(),
        dt = parseInt(nt.getTime()),
        yt = new Date(nt.getFullYear() + '/' + (nt.getMonth() + 1) + '/' + (nt.getDate() - 1) + ' 00:00:01'),
        tt = new Date(time),
        m = (dt - time) / 1000;
    if (m >= 86400 * 365 || tt.getFullYear() != nt.getFullYear()) {
        return tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate();
    } else if (m > 86400 * 3) {
        return (tt.getMonth() + 1) + '-' + tt.getDate();
    } else if (tt.getDate() == yt.getDate()) {
        return '昨天';
    } else if (m > 86400) {
        return Math.ceil(m / 86400) + '天前';
    } else if (m > 3600) {
        return Math.floor(m / 3600) + '小时前';
    } else if (m > 60) {
        return Math.floor(m / 60) + '分钟前';
    } else {
        return '刚刚';
    }
}
module.exports = {
  formatTime: formatTime,
  formatTimeStr: formatTimeStr
}
