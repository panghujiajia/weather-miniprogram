var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var u = require('../../utils/util.js');
Page({
    data: {
        autoplay: false, //自动滑动
        duration: 200,   //滑动时长
        circular: true,  //滑动衔接
        curIndex: 1,
        tabData: [{
            tabName: '15天天气',
            tabIndex: 1
        }, {
            tabName: '24H天气',
            tabIndex: 2
        }],
        locationData: null,     //定位信息
        addressData: null,       //地址信息
    },
    // tab切换
    changeTabs: function (e) {
        this.setData({
            curIndex: e.currentTarget.dataset.tabindex
        })
    },
    // 添加城市
    addCity: function () {
        wx.vibrateLong({
            success: function () {
                wx.showToast({
                    title: '还没做呢',
                    icon: 'none'
                })
            }
        })
    },
    // 获取用户定位
    getUserLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                if (!!res) {
                    var locationData = res;
                    // 请求参数
                    var ajaxData = {};
                    ajaxData.lat = locationData.latitude;
                    ajaxData.lon = locationData.longitude;
                    that.data.locationData = locationData;
                    that.data.ajaxData = ajaxData;
                    u.setStorage('locationData', locationData);
                    // that.getUserCity();
                    that.getForecast15days();
                    that.getForecast24hours();
                    that.getCondition();
                    that.getShortforecast();
                }
            }
        })
    },
    // 15天天气预报
    getForecast15days: function () {
        var that = this;
        u.ajax(u.urls.forecast15days, this.data.ajaxData, 'POST',
            function (res) {
                switch (res.data.code) {
                    case 0:
                        var forecast15daysData = res.data.data;
                        for (var i in forecast15daysData.forecast) {
                            var item = forecast15daysData.forecast[i];
                            item.weaIconSrc = '/images/icon/W' + item.conditionIdDay + '.png';  //根据天气id取对应图片
                        }
                        that.setData({
                            forecast15daysData: forecast15daysData
                        })
                        break;
                    default:
                        u.showToast('错误代码：' + res.data.code + ',请联系乔大大');
                        break;
                }
            }
        )
    },
    // 24小时天气预报
    getForecast24hours: function () {
        var that = this;
        u.ajax(u.urls.forecast24hours, this.data.ajaxData, 'POST',
            function (res) {
                switch (res.data.code) {
                    case 0:
                        var forecast24hoursData = res.data.data;
                        for (var i in forecast24hoursData.hourly) {
                            var item = forecast24hoursData.hourly[i];
                            item.weaIconSrc = '/images/icon/W' + item.iconDay + '.png';  //根据天气id取对应图片
                        }
                        that.setData({
                            forecast24hoursData: forecast24hoursData
                        })
                        break;
                    default:
                        u.showToast('错误代码：' + res.data.code + ',请联系乔大大');
                        break;
                }
            }
        )
    },
    // 实时天气预报
    getCondition: function () {
        var that = this;
        u.ajax(u.urls.condition, this.data.ajaxData, 'POST',
            function (res) {
                switch (res.data.code) {
                    case 0:
                        var conditionData = res.data.data;
                        that.getContainerBg(conditionData.condition.condition);//根据当前天气，获取背景图
                        that.setData({
                            conditionData: conditionData
                        })
                        break;
                    default:
                        u.showToast('错误代码：' + res.data.code + ',请联系乔大大');
                        break;
                }
            }
        )
    },
    // 短时预报
    getShortforecast: function () {
        var that = this;
        u.ajax(u.urls.shortforecast, this.data.ajaxData, 'POST',
            function (res) {
                switch (res.data.code) {
                    case 0:
                        var shortforecastData = res.data.data;
                        that.setData({
                            shortforecastData: shortforecastData
                        })
                        break;
                    default:
                        u.showToast('错误代码：' + res.data.code + ',请联系乔大大');
                        break;
                }
            }
        )
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
            }
        })
    },
    // 根据不同天气，显示不同的背景图片
    getContainerBg: function (val) {
        var weatherBgImg = '/images/ye.png';
        var weatherBgClass = 'ye';
        if (val.indexOf('雨') != -1) {
            weatherBgImg = '/images/yu.png';
            weatherBgClass = 'yu';
        } else if (val.indexOf('雪') != -1) {
            weatherBgImg = '/images/xue.png';
            weatherBgClass = 'xue';
        } else if (val.indexOf('阴') != -1 || val.indexOf('云') != -1) {
            weatherBgImg = '/images/yin.png';
            weatherBgClass = 'yin';
        } else if (val.indexOf('雾') != -1) {
            weatherBgImg = '/images/wu.png';
            weatherBgClass = 'wu';
        } else if (val.indexOf('晴') != -1) {
            weatherBgImg = '/images/qing.png';
            weatherBgClass = 'qing';
        }
        this.setData({
            weatherBgImg: weatherBgImg,
            weatherBgClass: weatherBgClass
        })
    },
    // 模糊匹配
    fuzzyMatch: function (val) {
        var iconArr = ['雨', '雪', '晴', '云', '阴', '夜', '夹', '阵', '沙', '雾', '尘', '霾', '冰雹'];
        var iconClass = {
            '雨': 'icon-dayu',
            '雪': 'icon-zhongxue',
            '晴': 'icon-qing',
            '云': 'icon-duoyun',
            '阴': 'icon-yin',
            '夜': 'icon-ye',
            '夹': 'icon-yujiaxue',
            '阵': 'icon-leizhenyu',
            '沙': 'icon-yangsha',
            '雾': 'icon-wu',
            '尘': 'icon-fuchen',
            '霾': 'icon-zhongdumai',
            '冰雹': 'icon-bingbao'
        }
        for (var i in iconArr) {
            var item = iconArr[i];
            if (val.indexOf(item) != -1) {
                return iconClass[item];
            }
        }
    },
    // 发起获取天气请求
    getWeather: function () {
        var that = this;
        var url = 'https://www.tianqiapi.com/api/';
        var city = this.data.addressData.city;
        // 传参要求不带 ‘市’
        city = city.slice(0, city.length - 1);
        var data = {
            version: 'v1',
            city: city
        };
        u.ajax(url, data, '',
            function (res) {
                var weatherData = res.data.data;
                for (var i in weatherData) {
                    var item = weatherData[i];
                    var tem1 = item.tem1;
                    var tem2 = item.tem2;
                    // 将温度的摄氏度单位去掉 ℃ 
                    item.tem1 = tem1.slice(0, tem1.length - 1);
                    item.tem2 = tem2.slice(0, tem2.length - 1);
                    item.weaClass = that.fuzzyMatch(item.wea);
                    for (var j in item.hours) {
                        var items = item.hours[j];
                        var tem = items.tem;
                        // 把逐时天气的摄氏度单位去掉
                        items.tem = tem.slice(0, tem.length - 1);
                        items.weaClass = that.fuzzyMatch(items.wea);
                    }
                }
                that.setData({
                    weatherData: weatherData
                })
                that.getNowNum();
            })
    },
    // 获取当前时间的温度
    getNowNum: function () {
        // 今日天气
        var today = this.data.weatherData[0];
        // 当前时间(小时)
        var timeNow = new Date().getHours();
        var nowWeather = '';    //当前温度
        var weatherBgImg = '/images/ye.png';
        // 根据当前时间，获取最接近当前时间的温度
        switch (timeNow) {
            case 23:
            case 0:
            case 1:
                nowWeather = today.hours[5];
                break;
            case 2:
            case 3:
            case 4:
                nowWeather = today.hours[6];
                break;
            case 5:
            case 6:
            case 7:
                nowWeather = today.hours[7];
                break;
            case 8:
            case 9:
            case 10:
                nowWeather = today.hours[0];
                break;
            case 11:
            case 12:
            case 13:
                nowWeather = today.hours[1];
                break;
            case 14:
            case 15:
            case 16:
                nowWeather = today.hours[2];
                break;
            case 17:
            case 18:
            case 19:
                nowWeather = today.hours[3];
                break;
            case 20:
            case 21:
            case 22:
                nowWeather = today.hours[4];
                break;
            default:
                nowWeather = '';
                break;
        }
        // 根据不同天气，显示不同的背景图片
        if (nowWeather.wea.indexOf('雨') != -1) {
            weatherBgImg = '/images/yu.png';
        } else if (nowWeather.wea.indexOf('雪') != -1) {
            weatherBgImg = '/images/xue.png';
        } else if (nowWeather.wea.indexOf('阴') != -1 || nowWeather.wea.indexOf('云') != -1) {
            weatherBgImg = '/images/yin.png';
        } else if (nowWeather.wea.indexOf('雾') != -1) {
            weatherBgImg = '/images/wu.png';
        } else if (nowWeather.wea.indexOf('晴') != -1) {
            weatherBgImg = '/images/qing.png';
        }
        this.setData({
            today: today,
            nowWeather: nowWeather,
            weatherBgImg: weatherBgImg
        })
    },
    // 获取名人名言
    getQuotes: function () {
        var that = this;
        var url = 'http://api.avatardata.cn/MingRenMingYan/Random';
        var data = {
            key: 'b7133dffebd04e1181c1e3e93278c203'
        }
        u.ajax(url, data, 'get', function (res) {
            if (res.data.reason == 'Succes') {
                // famous_name  名人
                // famous_saying名言
                var quotesData = res.data.result;
                that.setData({
                    quotesData: quotesData
                })
            }
        }, function (res) {
            console.log(res)
        })
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var qqMap = new QQMapWX({
            key: '5DUBZ-ORBKV-UUGPC-UKT4G-CGHZ6-JQBGX'
        })
        // 获取当前时间 --- 小时
        var curHour = new Date().getHours();
        this.setData({
            curHour: curHour
        })
        this.data.qqMap = qqMap;
        this.getUserLocation();
        this.getQuotes();
    },
    onReady: function () {
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
        this.onLoad();
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