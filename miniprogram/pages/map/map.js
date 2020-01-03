// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
// 设置标记点
    markers: [
      {
      iconPath: "/images/ljx.png",
      id: 4,
      latitude: 31.938841,
      longitude: 118.799698,
      width: 30,
      height: 30
      }

    ]  ,
    
//当前定位位置
latitude:'',
longitude: '',  
  },
  getLoc: function () {


//使用微信内置地图查看标记点位置，并进行导航
wx.openLocation({
  latitude: this.data.markers[0].latitude,//要去的纬度-地址
  longitude: this.data.markers[0].longitude,//要去的经度-地址
  })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getLocation({
      // type: "wgs84",
      type: "gcj02",
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const speed = res.speed;
        console.log(longitude)
        console.log(latitude)
        this.setData({
          latitude:latitude,
longitude: longitude,  
        })
      },
    })
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