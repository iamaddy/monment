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
        editing: false,
        canAddPic: true,
        moments: [],
        currentIndex: 0,
        deleteHide: 'hide'
    },
    //事件处理函数
    addPicsTap(){
        var that = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;

                tempFilePaths.forEach(function(item, index) {
                    that.data.moments.push({
                        current: 1,
                        url: item,
                        check: index === 0,
                        change: index !== 0
                    })
                });

                that.setData({
                    moments: that.data.moments
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
            editing: true
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
            sizeType: ['original', 'compressed'],
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
    saveDataToStorage(data) {
        wx.setStorage({
            key: Storage_KEY,
            data: data,
            success: function() {
                //
            },
            fail: function() {
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
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
            }
        });
    },
    bindVideoTap: function() {
        var that = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function(res) {
                /*that.setData({
                    src: res.tempFilePath
                })*/
            }
        })
    },
    loadData() {
        var that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            });
        });

        this.setData({
            windowWidth: wx.getSystemInfoSync().windowWidth
        });

        wx.getStorage({
            key: Storage_KEY,
            success: function(res) {
                var data = res.data;
                that.setData({
                    moments: data
                });
            },
            fail: function(res) {

            }
        });
    },
    imageOnLoad(e) {
        console.log(this);
        wx.getImageInfo({
            src: e.target.dataset.src,
            success: function(res) {
                console.log(res.width)
                console.log(res.height)
            }
        })
    },
    showImageDelete() {
        this.setData({
            deleteHide: ""
        });
    },
    pageTap(e) {
        if (!e.target.dataset.isimg) {
            this.setData({
                deleteHide: "hide"
            });
        }
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
            title: '确定要该删除图片吗',
            success: function(res) {
                if (res.confirm) {
                    that.data.moments.splice(that.data.currentIndex, 1);
                    that.data.currentIndex = 0;

                    if(that.data.moments.length){
                        that.data.moments[0].change = 0;
                        that.data.moments[0].check = 1;
                    }

                    that.setData({
                        moments: that.data.moments
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
    }
})