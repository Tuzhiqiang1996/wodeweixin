
Page({
  data: {
    //1:添加属性list   保存电影列表
    list: [],
    //2:添加属性start  电影列表开始记录数据 0
    start: 0,
    //3:添加属性count  电影列表一页行数     20
    count: 20,
  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },

  //15:31
  //10:添加函数jumpComment 跳转详情组件
  jumpComment: function (event) {
    //(1)为button添加自定义属性 data-id 电影id
    //(2)为button添加点击事件,调用jumpComment
    //(3)在函数内添加参数event
    //(4)依据参数event获取自定义属性id 42
    //console.log(1);
    var id = event.target.dataset.id;
    console.log(id)
    //(5)创建跳转path并且绑定参数id
    var path = "/pages/details/details?id=" + id;
    //(6)删除并且跳转详情组件
    //wx.redirectTo({
    //  url: path,
    //})
    //(6)保存并且跳转详情组件
    wx.navigateTo({
      url: path,
    });
  },
  //4:创建通用函数 loadMore 加载电影列表
  loadMore: function () {
    //5:调用云函数web1908ddfind
    //6:参数start count
    wx.cloud.callFunction({
      name: "web1908ddfind",
      data: {
        start: this.data.list.length,//起始行数
        count: this.data.count       //一页行数
      },//参数
    }).then(res => {            //调用成功回调
      //云函数返回结果  res.result
      //res.result 字符串类型数据
      //将字符串类型数据转js 对象  11:30
      var rows = JSON.parse(res.result);
      //subjects 电影列表
      console.log(rows.subjects);
      //7:接收云函数返回结果
      //8:保存list[覆盖]]
      //this.setData({list:rows.subjects})
      //8:获取新电影列表
      var rows1 = rows.subjects;
      //9:追加到现有电影列表中 concat
      rows = this.data.list.concat(rows1);
      //10:保存list
      this.setData({ list: rows })
    })
      .catch(err => { console.log(err) })//回调失败
    //9:在onLoad调用
    //10:在上拉触底调用 34
  },
  onLoad: function (options) {
    this.loadMore();
  },
  onReady: function () {

  },
  onShow: function () {

  },

  onHide: function () {

  },
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
    //下一页
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})