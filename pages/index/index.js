var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
    data: {
        locationData: null,
        addressData: null
    },
    // 获取用户定位
    getUserLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                if (!!res) {
                    var locationData = res;
                    that.setData({
                        locationData: locationData
                    })
                    that.getUserCity();
                }
            }
        })
    },
    // 根据用户定位坐标获取用户城市
    getUserCity: function () {
        var that = this;
        var locationData = this.data.locationData;
        this.data.qqMap.reverseGeocoder({
            location: {
                latitude: locationData.latitude,
                longitude: locationData.longitude
            },
            success: function (res) {
                if (res.status == 0) {
                    var addressData = res.result.address_component;
                    that.setData({
                        addressData: addressData
                    })
                    that.getWeather()
                }
            },
            fail: function (res) {
            }
        })
    },
    // 发起获取天气请求
    getWeather: function () {
        var city = this.data.addressData.city;
        // 传参要求不带 ‘市’
        city = city.slice(0, city.length - 1);
        wx.request({
            url: 'https://www.tianqiapi.com/api/',
            data: {
                version: 'v1',
                city: city
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                console.log(res);
            },
            fail: function () {
            }
        })
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var qqMap = new QQMapWX({
            key: '5DUBZ-ORBKV-UUGPC-UKT4G-CGHZ6-JQBGX'
        })
        this.data.qqMap = qqMap;
        // this.getUserLocation()
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        // this.data.qqMap.search({
        //     keyword: '酒店',
        //     success: function (res) {
        //         console.log(res);
        //     },
        //     fail: function (res) {
        //         console.log(res);
        //     },
        //     complete: function (res) {
        //         console.log(res);
        //     }
        // })
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: 'title', // 分享标题
            desc: 'desc', // 分享描述
            path: 'path' // 分享路径
        }
    }
})