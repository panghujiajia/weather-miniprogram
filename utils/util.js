const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
const ajax = (url, data, method, s, f, c) => {
    wx.showLoading({
        title: '加载中...',
        icon: 'none',
        mask: true
    })
    wx.request({
        url: url,
        data: data || '',
        method: method || 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
            if (s)
                s(res)
        },
        fail: function (res) {
            wx.showToast('网络异常，请重试！');
            if (f)
                f(res)
        },
        complete: function (res) {
            wx.hideLoading()
            if (c)
                c(res)
        }
    })
}
const setStorage = (key, val) => {
    wx.setStorageSync(key, val);
}
const getStorage = key => {
    return wx.getStorageSync(key);
}
module.exports = {
    formatTime: formatTime,
    ajax: ajax,
    setStorage: setStorage,
    getStorage: getStorage
}
