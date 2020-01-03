// pages/comment/comment.js
const db = wx.cloud.database();
//两个环境
// const db=wx.cloud.database({env:"环境id"});
Page({
  data: {
    ll: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //1:添加属性movieid:  接收home组件传递来id
    movieid: 0,
    //2:添加属性info 接收电影详细信息
    info: [],
    //3:添加属性val2 接收电影评论
    val2: "",
    val3: 0,
    image: [],//保存选中后的监事图片
    fileIDS: []   //保存用户上图片数组
  },
  onChangeVal2: function (event) {
    //功能:用户输入留言获取留言内容并且保存val2
    //1:添加参数event
    //2:获取event中用户输入留言
    var data = event.detail;
    //3:保存val2
    this.setData({ val2: data });
    // console.log(this.data.val2);
  },
  onChangeval3: function (event) {
    // 获取用户评分并保存
    // 添加参数event
    // 通过event获取评分
    var score = event.detail;
    // console.log(score)
    // 保存
    this.setData({ val3: score })
    // console.log(this.data.val3)
  },
  selectImg: function () {
    // console.log(11)
    wx.chooseImage({
      count: 9,//选中图片的数量最多9张
      // 图片类型  原图     压缩图
      sizeType: ["original", "compressed"],
      //  图片 来源   相册  相机
      sourceType: ["album", "camera"],
      // 选中成功回调函数
      success: (res) => {
        // 获取临时图片并保存 
        var list = res.tempFilePaths;
        this.setData({ image: list })
      },
    })
  },
  submit: function () {
    //上传图片并且添加数据到云数据库中
    // 上传图片加载提示框
    wx.showLoading({
      title: '评论中...',
    })
    // 在data中添加属性fileIDS:[]
    // 保存文件id
    // 创建数据保存所有promise对象 rows
    var rows = [];
    if (this.data.image.length == 0) {
      wx.showToast({
        title: '请选择图片...',
      })
      return;
    }
    // 创建循环遍历选中数组image
    for (var i = 0; i < this.data.image.length; i++) {
      // console.log(1)
      // 创建promise对象完成上传一张图片任务
      rows.push(new Promise((resolve, reject) => {
        // console.log(2)
        // 获取当前上传图片名称
        var item = this.data.image[i]
        // console.log(3)
        // console.log(item)
        // 创建新文件名
        // 创建正、则表达式拆分文件名后缀
        var reg = /\.\w+$/
        var suffix = reg.exec(item)[0]  //.jpg/.png
        // console.log(suffix)
        // 创建时间 随机数
        var newFile = new Date().getTime();
        newFile += Math.floor(Math.random() * 9999)
        // 拼接新文件名
        newFile += suffix;
        // console.log(newFile)
        // 将文件上传云存储
        wx.cloud.uploadFile({
          cloudPath: newFile, //新文件明
          filePath: item,  //原文件名 临时文件
          success: (res) => {  //上传成功
            console.log(5)
            //将上传图片fileID 保存fileIDS
            this.data.fileIDS.push(res.fileID)
            //上传成功
            resolve()
            // console.log(6,res)
            // console.log(this.data.fileIDS)
          }
        })
      }))
    }
    console.log(22)
    wx.showLoading({
      title: '评论正在发表中...',
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.showToast({
        title: '评论发表成功！',
      })
    }, 2000)

    // 将图片id 评分 评论添到云数据库
    // 在云开发控制面板中创建集合web1908movie
    // 等待所有rows数组中所有promise对象执行完毕
    Promise.all(rows).then(res => {
      console.log(7)
      // 添加钩子函数,所有promise执行结束
      // 获取评分
      var v3 = this.data.val3;
      // 获取评论留言内容
      var v2 = this.data.val2;
      // 获取图片id
      var mid = this.data.fileIDS;
      console.log(v3, v2, mid)
      // 判断如果 留言内容为空 
      if (!v2) {
        wx.showToast({
          title: '用户未评论',
        })
        v2 = "用户未评论"
      }
      // 在文件开头commmon.js创建db数据库对象
      // 添加一条记录 添加成功提示
      db.collection("web1908movie")
        // 添加一条记录 添加成功提示
        .add({
          data: {
            content: v2, //评论内容
            score: v3,  //评分
            fids: mid, //文件id
            mid: this.data.movieid,  //mid评论电影id
          }
        }).then(res => {
          //添加成功提示
          // 隐藏加载提示框;显示发表成功的提示框
          wx.hideLoading();
          wx.showToast({
            title: '评论发表成功...',
          })
        })

    })
  },
  onLoad: function (options) {
    //2:接收home参数id
    var id = options.id;
    //2.1:将接收id保存data属性中
    this.setData({ movieid: id })
    //3:调用loadMore
    this.loadMore();
  },
  loadMore: function () {
    //功能:调用云函数 13
    //1:调云函数web1908detail
    wx.cloud.callFunction({
      name: "web1908detail",//云函数名称
      data: { id: this.data.movieid },//云函数参数
      success: (res) => {
        //console.log(res.result);//调用成功返回结果
        //1.2:将返回字符串结果转js object
        var obj = JSON.parse(res.result);
        //console.log(obj);
        //1.3:在data中添加属性info 保存云函数结果
        //1.4:保存   10:38
        this.setData({ info: obj });
        // console.log(this.data.info)
      }
    })
    //2:在onLoad调用loadMore
    //3:将云函数返回结果保存
  },



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