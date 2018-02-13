//index.js
//获取应用实例
const app = getApp()
var bmap = require('bmap-wx.min.js'); 
Page({
  data: {
    nu:null,
    currentCity:'',
    date:'',
    currentTemperature:'',
    pm25:'',
    src:'',
    temperature:'',
    weatherDesc:'',
    wind:'',
    originalData:'',
    originalDate:[],
    array: [{ msg: '1' }, { msg: '2' }]
  },
  selectBtn:function(){
    console.log(this.data.nu);
    app.getExpressMsg(this.data.nu,function(data){
      console.log(data);
    })
  },
  inputVal:function(e){
    this.setData({nu:e.detail.value});
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
      // console.log(weatherData);
      // debugger;
      for (var i = 1; i < originalData.length; i ++){
        var obj = {};
        obj.week = originalData[i].date;
        obj.wether = originalData[i].temperature;
        obj.src = originalData[i].dayPictureUrl;
        originalDate.push(obj);
      }
      // console.log(originalDate);

      // console.log(originalData);

      that.setData({
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

      // console.log(currentTemperature);
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    }); 
  }
})
