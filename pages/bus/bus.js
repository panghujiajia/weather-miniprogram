var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var u = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageSize: 20,   //每页显示的数据
        pageIndex: 1    //多少页
    },
    // 查询用户周边的公交站点
    getNearbyBus: function () {
        var that = this;
        // 调用接口
        this.data.qqMap.search({
            keyword: '公交站',
            page_size: this.data.pageSize,
            page_index: this.data.pageIndex,
            success: function (res) {
                var oldData = that.data.busData;
                var busData = res.data;
                // 进行数据合并
                if (oldData != null) {
                    busData = oldData.concat(busData);
                }
                // 数据总条数除以单页数向上取整，得到需要请求的总页码数
                var totalPage = Math.ceil(res.count / that.data.pageSize);
                // 如果当前页面小于总页面，继续请求
                if (totalPage > that.data.pageIndex) {
                    that.data.pageIndex++;
                    that.getNearbyBus()
                }
                that.setData({
                    busData: busData
                })
                // 判断数据是否获取完毕，完毕即打印公交站名
                if (that.data.busData.length == res.count) {
                    // 讲道理返回的数据应该是按距离升序排列的,取第一条就是离我最近的
                    var nearByData = that.data.busData[0];
                    // 获取公交车信息转成数组
                    var nearByBus = nearByData.address.split(',');
                    that.setData({
                        nearByData: nearByData,
                        nearByBus: nearByBus
                    })
                }
            },
            fail: function (res) {
                console.log(res);
            }
        })
    },
    // 匹配最接近当前位置的公交站

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var qqMap = new QQMapWX({
            key: '5DUBZ-ORBKV-UUGPC-UKT4G-CGHZ6-JQBGX'
        })
        this.data.qqMap = qqMap;
        this.getNearbyBus();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})