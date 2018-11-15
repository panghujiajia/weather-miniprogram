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
const mainUrl = 'http://aliv8.data.moji.com';
// 请求地址
const urls = {
    shortforecast: mainUrl + '/whapi/json/aliweather/shortforecast',        //短时预报
    forecast24hours: mainUrl + '/whapi/json/aliweather/forecast24hours',    //24小时天气预报
    aqiforecast5days: mainUrl + '/whapi/json/aliweather/aqiforecast5days',  //5天空气质量
    alert: mainUrl + '/whapi/json/aliweather/alert',                        //天气预警
    index: mainUrl + '/whapi/json/aliweather/index',                        //生活指数
    condition: mainUrl + '/whapi/json/aliweather/condition',                //天气实况
    forecast15days: mainUrl + '/whapi/json/aliweather/forecast15days',      //15天天气预报
    limit: mainUrl + '/whapi/json/aliweather/limit',                        //限行数据
    aqi: mainUrl + '/whapi/json/aliweather/aqi',                            //空气质量
}
// 请求封装
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
        header: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Authorization": "APPCODE c6bb3b40aa034fb7ba5b49cffc251e8b"
        },
        success: function (res) {
            if (s)
                s(res)
        },
        fail: function (res) {
            wx.showToast({
                title: '网络异常，请重试！',
                icon: 'none'
            });
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
// 设置缓存
const setStorage = (key, val) => {
    wx.setStorageSync(key, val);
}
// 获取缓存
const getStorage = key => {
    return wx.getStorageSync(key);
}
// showtoast
const showToast = obj => {
    var defObj = {
        mask: true,
        icon: 'none'
    }
    if ('object' == typeof (obj)) {
        var newObj = Object.assign(defObj, obj);
        wx.showToast(newObj);
    } else if ('string' == typeof (obj)) {
        defObj.title = obj;
        wx.showToast(defObj);
    }
}
module.exports = {
    formatTime: formatTime,
    ajax: ajax,
    urls: urls,
    showToast: showToast,
    setStorage: setStorage,
    getStorage: getStorage
}
