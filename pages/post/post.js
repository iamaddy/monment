//logs.js
var util = require('../../utils/util.js');
var Storage_KEY = 'momentKey';
Page({
  data: {
    content: "",
    images: [],
    location: "所在位置",
    state: 0,
    time: 0
  },
  onLoad: function () {

  },
  bindPostAction: function(){
    var that = this;
    if(this.data.content.length === 0 && this.data.images.length === 0){
      wx.showToast({
        title: '写点内容再发表',
        icon: 'loading',
        duration: 1000
      });
      return;
    }

    wx.getStorage({
      key: Storage_KEY,
      success: function(res) {
        that.storeDataIntoStorage(res);
      },
      fail: function(res){
        that.storeDataIntoStorage(res);
      }
    });
  },
  storeDataIntoStorage: function(res){
    var data = res.data || [];
    this.setData({
      time: Date.now()
    });

    data.unshift(this.data);
    console.log(data);
    wx.setStorage({
      key: Storage_KEY,
      data: data,
      success: function(){
        wx.navigateBack();
      },
      fail: function(){
        wx.showToast({
          title: '发表失败',
          icon: 'loading',
          duration: 1000
        });
      }
    });
  },
  btnPickLocation: function(){
    var that = this;
    wx.chooseLocation({
      success: function(e){
        console.log(e);
        that.setData({
          location: e.name
        });
      },
      fail: function(){

      },
      cancle: function(){

      },
      complete: function(){

      }
    })
  },
  bindTextInput: function(e){
    this.setData({
      content: e.detail.value
    });
  },
  bindChooseTap: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        
        console.log(tempFilePaths);
        that.setData({
          images: tempFilePaths
        });
      }
    });
  },
})
