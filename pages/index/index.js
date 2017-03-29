//index.js
//获取应用实例
var app = getApp();
var Storage_KEY = 'momentKey';
var Util = require('../../utils/util.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    toView: 'red',
    scrollTop: 100,
    moments: [],
    deleteHide: 'hide'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindPostViewTap: function() {
    wx.navigateTo({
      url: '../post/post'
    })
  },
  bindChangeImageTap: function(event) {
    var that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        that.data.moments[event.target.dataset.index].images.splice(event.target.dataset.idx, 1, tempFilePaths);
        that.setData({
          moments: that.data.moments
        });
        that.saveDataToStorage(that.data.moments);
      }
    });
  },
  saveDataToStorage(data){
    wx.setStorage({
      key: Storage_KEY,
      data: data,
      success: function(){
        //
      },
      fail: function(){
        //
      }
    });
  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  bindImageTap: function() {
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    });
  },
  bindVideoTap: function() {
    var that = this
      wx.chooseVideo({
          sourceType: ['album','camera'],
          maxDuration: 60,
          camera: 'back',
          success: function(res) {
              /*that.setData({
                  src: res.tempFilePath
              })*/
          }
      })
  },
  loadData(){
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });

    wx.getStorage({
      key: Storage_KEY,
      success: function(res) {
        var data = res.data;
        data.forEach(function(item){
          item.timeStr = Util.formatTimeStr(item.time);
        });
        that.setData({
          moments: data
        });
      },
      fail: function(res){
        
      }
    });
  },
  imageOnLoad(e){
    console.log(this);
    wx.getImageInfo({
      src: e.target.dataset.src,
      success: function (res) {
        console.log(res.width)
        console.log(res.height)
      }
    })
  },
  showImageDelete(){
    this.setData({
      deleteHide: ""
    });
  },
  pageTap(e){
    if(!e.target.dataset.isimg){
      this.setData({
        deleteHide: "hide"
      });
    }
  },
  tryDeleteImage(){
    wx.showToast({
      title: '确定要删除图片吗',
      icon: 'loading',
      duration: 1000
    });
  },
  onLoad: function () {
    console.log('onLoad')
    this.loadData();
  },
  onShow(){
    this.loadData();
  }
})
