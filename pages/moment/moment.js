//index.js
//获取应用实例
var app = getApp();
var Storage_KEY = 'momentKey';
var BG_STORAGE_KEY = '__BG_URL_KEY';
var USER_INFO_STORAGE_KEY = '__USER_INFO_KEY';

var Util = require('../../utils/util.js');

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        toView: 'red',
        scrollTop: 100,
        editing: false,
        canAddPic: true,
        bgImgUrl: '',
        moments: [],
        currentIndex: 0,
        deleteHide: 'hide'
    },
    //事件处理函数
    addPicsTap(){
        var that = this;
        var len = that.data.moments.length;
        wx.chooseImage({
            count: 9 - len,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;

                tempFilePaths.forEach(function(item, index) {
                    that.data.moments.push({
                        current: 1,
                        url: item,
                        check: len ? 0 : index === 0,
                        change: len ? 1 : index !== 0
                    })
                });

                that.setData({
                    moments: that.data.moments,
                    canAddPic: that.data.moments.length !== 9
                });

                that.saveDataToStorage(that.data.moments);

                if (that.data.moments.length) {
                    that.setData({
                        editing: true
                    });
                }
            }
        });
    },
    finishEditor() {

        this.data.moments.forEach(function(item) {
            item.check = false;
            item.change = false;
            item.current = 0;
        });
        this.saveDataToStorage(this.data.moments);
        this.setData({
            editing: false,
            canAddPic: false,
            moments: this.data.moments
        });
    },
    checkImage(event) {
        var index = event.currentTarget.dataset.index;
        if (typeof index === 'undefined') return;

        this.data.currentIndex = index;

        this.data.moments.forEach(function(item, idx) {
            if (idx === index) {
                item.check = true;
                item.current = 1;
            } else {
                item.change = true;
                item.current = 1;
            }
        });

        this.setData({
            moments: this.data.moments,
            editing: true,
            canAddPic: this.data.moments.length !== 9
        });

        this.saveDataToStorage(this.data.moments);
    },
    changeImage(event) {
        var index = event.currentTarget.dataset.index;
        if (typeof index === 'undefined') return;

        var data = this.data.moments[index];
        var temp = this.data.moments[this.data.currentIndex];
        this.data.moments[index] = temp;
        this.data.moments[this.data.currentIndex] = data;
        this.data.currentIndex = index;
        this.setData({
            moments: this.data.moments
        });
        this.saveDataToStorage(this.data.moments);
    },
    bindChangeImageTap: function(event) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths[0];
                that.data.moments[event.target.dataset.index].images.splice(event.target.dataset.idx, 1, tempFilePaths);
                that.setData({
                    moments: that.data.moments
                });
                that.saveDataToStorage(that.data.moments);
            }
        });
    },
    saveDataToStorage(data, key) {
        wx.setStorage({
            key: key || Storage_KEY,
            data: data,
            success: function() {
                //
            },
            fail: function() {
                //
            }
        });
    },
    bindChangeBgImageTap: function() {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];
                that.setData({
                    bgImgUrl: tempFilePaths
                });
                that.saveDataToStorage(tempFilePaths, BG_STORAGE_KEY);
            }
        });
    },
    loadData() {
        var that = this;
        //调用应用实例的方法获取全局数据
        wx.getStorage({
            key: USER_INFO_STORAGE_KEY,
            success: function(res) {
                that.setData({
                    userInfo: res.data
                })
            }
        });

        wx.getStorage({
            key: BG_STORAGE_KEY,
            success: function(res) {
                that.setData({
                    bgImgUrl: res.data
                })
            }
        });

        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            });
            that.saveDataToStorage(userInfo, USER_INFO_STORAGE_KEY);
        });

        this.setData({
            windowWidth: wx.getSystemInfoSync().windowWidth
        });

        wx.getStorage({
            key: Storage_KEY,
            success: function(res) {
                var data = res.data;
                data.forEach(function(item) {
                    item.check = false;
                    item.change = false;
                    item.current = 0;
                });
                that.setData({
                    moments: data
                });
            },
            fail: function(res) {

            }
        });
    },
    bindPreviewImageTap(){
        var urls = [];
        this.data.moments.forEach(function(item) {
            urls.push(item.url)
        });

        wx.previewImage({
            current: this.data.moments[this.data.currentIndex].url,
            urls: urls
        })
    },
    deletePhoto() {
        var that = this;
        wx.showModal({
            title: '确定要删除这张图片吗',
            success: function(res) {
                if (res.confirm) {
                    that.data.moments.splice(that.data.currentIndex, 1);
                    that.data.currentIndex = 0;

                    if(that.data.moments.length){
                        that.data.moments[0].change = 0;
                        that.data.moments[0].check = 1;
                    }

                    that.setData({
                        moments: that.data.moments,
                        canAddPic: that.data.moments.length !== 9
                    });

                    that.saveDataToStorage(that.data.moments);
                } else if (res.cancel) {

                }
            }
        })
    },
    onLoad: function() {

    },
    onShow() {
        this.loadData();
        this.setData({
            canAddPic: !!this.data.moments.length
        });
    }
})