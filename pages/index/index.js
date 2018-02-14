//index.js
//获取应用实例

const app = getApp()
var bmap = require('bmap-wx.min.js'); 
Page({
  data: {
    currentCity:'',//城市
    date:'',//日期
    currentTemperature:'',//当前温度
    pm25:'',//pm2.5
    src:'',//天气图片地址
    temperature:'',//温度范围
    weatherDesc:'',//天气说明
    wind:'',//风力
    originalData:'',//未来几天天气数据
    originalDate:[]//保存未来几天数据
  },
  onLoad: function () {

    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'WBzyHsoHB5zTSb2jBTM8I7bInpI3y8gH'
    });
    var fail = function (data) {
      console.log(data);
    };
    var success = function (data) {
      //data为返回数据对象
      //以下变量同上
      var weatherData = data.currentWeather[0],
          originalData = data.originalData.results[0].weather_data,
          len = weatherData.date.length,
          currentCity = weatherData.currentCity,
          date = weatherData.date.slice(3, 8),
          currentTemperature = weatherData.date.substring(14, len-2),
          src = originalData[0].dayPictureUrl,
          pm25 = weatherData.pm25,
          temperature = weatherData.temperature,
          weatherDesc = weatherData.weatherDesc,
          wind = weatherData.wind,
          originalDate = [];
      for(var i = 1; i < originalData.length; i ++){
        var obj = {};
        obj.week = originalData[i].date;
        obj.wether = originalData[i].temperature;
        obj.src = originalData[i].dayPictureUrl;
        originalDate.push(obj);
      };
      that.setData({
        //数据赋值
        weatherData: weatherData,
        originalData: originalData,
        currentCity: currentCity,
        date: date,
        currentTemperature: currentTemperature,
        src: src,
        pm25: pm25,
        temperature: temperature,
        weatherDesc: weatherDesc,
        wind: wind,
        originalDate: originalDate,
        originalData: originalData[0]
      });
    };
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    }); 
  }
})
