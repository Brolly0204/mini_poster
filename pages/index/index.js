//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winWidth: 0,
    winHeight: 0,
    canvasImg: [],
    imgW: 1014,
    imgH: 1520
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 获取设备信息
  getSystemInfo() {
    let that = this
    wx.getSystemInfo({
      success: res => {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
  // 生成海报
  createPoster() {
    let that = this
    wx.showLoading({
      title: '海报生成中...',
      icon: 'loading',
      duration: 2000
    })
    const ctx = wx.createCanvasContext('canvas_poster')
    let imgWidth = 140
    let imgHeight = 140
    let winWidth = that.data.winWidth
    let winHeight = that.data.winHeight

    const posterHeight = winWidth / (this.data.imgW / this.data.imgH)

    const imgX = (winWidth - imgWidth) / 2 + 2
    const imgY = posterHeight - imgHeight * 2

    ctx.clearRect(0, 0, 0, 0)
    //  绘制图片模板的 底图
    ctx.drawImage('/pages/images/poster_bg3.png', 0, 0, winWidth, posterHeight)

    ctx.drawImage('/pages/images/zhufeng.jpg', imgX, imgY, imgWidth, imgHeight)

    // ctx.drawImage(this.data.userInfo.avatarUrl, 0, 0, 100, 100)

    ctx.stroke()
    ctx.draw(false, res => {
      wx.canvasToTempFilePath({
        canvasId: 'canvas_poster',
        destWidth: this.data.imgW,
        destHeight: this.data.imgH,
        success: res => {
          this.data.canvasImg.push(res.tempFilePath)
          wx.hideLoading()
        },
        fail: err => {
          console.log('canvasToTempFilePath', err)
        }
      })
    })
  },
  // 保存生成海报
  saveAchievement() {
    wx.showLoading({
      title: '图片保存中...',
      icon: 'loading',
      duration: 2000
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.canvasImg[0],
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功'
        })
      },
      fail: err => {
        if (
          err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' ||
          err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied'
        ) {
          wx.showModal({
            title: '无法保存',
            content: '请允许微信访问你的图片。',
            showCancel: false
          })
          this.isOpenSetting = false
        } else if (
          err.errMsg === 'saveImageToPhotosAlbum:fail system deny' ||
          err.errMsg === 'saveImageToPhotosAlbum:fail:system denied'
        ) {
          wx.showModal({
            title: '无法保存',
            content: '请在手机的“设置-隐私-照片”选项中，允许微信访问你的图片。',
            showCancel: false
          })
        }
        wx.hideLoading()
      }
    })
  },
  onLoad: function() {
    // 获取设备信息
    this.getSystemInfo()
    // 生成海报
    this.createPoster()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo

    this.setData(
      {
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      },
      () => {
        // // 生成海报
        // this.createPoster()
      }
    )
  }
})
