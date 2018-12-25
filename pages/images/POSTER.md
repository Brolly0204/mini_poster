# 圣诞狂欢海报

![圣诞节](assets/markdown-img-paste-20181225164301976.png)

圣诞狂欢夜生成一个专属于自己的海报

小程序生成海报分享到朋友圈的方式有两种，一种是使用后端方式（生成图片耗用内存比较大），一种是使用小程序自带的canvas生成；使用小程序的canvas是一个不错的选择。

## 生成海报
pages/index/index.wxml

定义canvas标签
```
<!--index.wxml-->
  <view class="canvas-box" catchlongpress="saveAchievement">
      <canvas style="width: 375px;height: 562px;" canvas-id="canvas_poster"/>
  </view>
```




### 生成专属海报

pages/index/index.js
```
createPoster() {
  let that = this;
  wx.showToast({
    title: '海报生成中...',
    icon: 'loading',
    duration: 2000
  });

  // 获取canvas画布上下文
  const ctx = wx.createCanvasContext('canvas_poster');
  ...
},
```

### 计算图片位置、尺寸

```
// 二维码图片高度
let imgWidth = 140
let imgHeight = 140
let winWidth = that.data.winWidth
let winHeight = that.data.winHeight

// 计算背景图坐标x y
const imgBgX = (winWidth - imgWidth) / 2 + 2
const imgBgY = posterHeight - (imgHeight * 2)

// 计算背景图片高度
const posterHeight = winWidth / (this.data.imgW / this.data.imgH)

```

### 绘制海报背景图

```
  // 清空出空白矩形
  ctx.clearRect(0, 0, 0, 0);

  // 开始绘制海报背景图  drawImage(图片URL, x, y, 宽度，高度)
  ctx.drawImage('/pages/images/poster_bg3.png', 0, 0, winWidth, posterHeight);
```

### 绘制二维码 

```
// 绘制二维码 drawImage(图片URL, x, y, 宽度，高度)
ctx.drawImage('/pages/images/zhufeng.jpg', imgBgX, imgBgY, imgWidth, imgHeight)
```

### 开始绘制海报

```
// 绘制路径
ctx.stroke()

// 绘制图像
ctx.draw(false, (res) => {
  // 将绘制图像转为图片输出
  wx.canvasToTempFilePath({
    canvasId: 'canvas_poster',
    destWidth: this.data.imgW,
    destHeight: this.data.imgH,
    success: (res) => {
      // 保存图片地址
      this.data.canvasImg.push(res.tempFilePath)
      wx.hideLoading()
    },
    fail: (err) => {
      console.log('canvasToTempFilePath', err)
    }
  })
})
```

ctx.draw是异步方法，在canvas绘制完成后调用wx.canvasToTempFilePathApi将canvas转为图片输出，这样需要注意，wx.canvasToTempFilePath需要写在this.ctx.draw的回调中，并且在组件中使用这个接口需要在第二个入参传入this（坑），如下


## 保存海报到系统相册
接着，我们要把它保存进用户的系统相册中去，实现这个功能，我们主要靠wx.canvasToTempFilePath和wx.saveImageToPhotosAlbum这两个API。

### 长按保存事件绑定

```
<!--index.wxml-->
  <view class="canvas-box" catchlongpress="saveAchievement">
      <canvas style="width: 375px;height: 562px;" canvas-id="canvas_poster"/>
  </view>
```

### 长按保存

先通过wx.canvasToTempFilePath将”canvas“上绘制的图像生成临时文件的形式，然后再通过wx.saveImageToPhotosAlbum进行保存到系统相册的操作。

```
  // 保存生成海报
  saveAchievement() {
    wx.showToast({
      title: '图片保存中...',
      icon: 'loading',
      duration: 2000
    });

    // 保存到相册
    wx.saveImageToPhotosAlbum({
      filePath: this.data.canvasImg[0],
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功'
        })
      },
      // 失败处理（ios android）
      fail: (err) => {
        if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' || err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied') {
          wx.showModal({
            title: '无法保存',
            content: '请允许微信访问你的图片。',
            showCancel: false
          })
          this.isOpenSetting = false
        } else if (err.errMsg === 'saveImageToPhotosAlbum:fail system deny' || err.errMsg === 'saveImageToPhotosAlbum:fail:system denied') {
          wx.showModal({
            title: '无法保存',
            content: '请在手机的“设置-隐私-照片”选项中，允许微信访问你的图片。',
            showCancel: false
          })
        }
        wx.hideLoading()
      }
    })
  }
```


## 小程序”双旦“课程安排

### 任课讲师：

高级架构讲师：许海英

### 授课时间：

每周一、周三、周五晚20：00--22：00

### 小程序最新公开课时间：

本周五（12月26日晚: 20:00~22:00）

在线地址：

https://ke.qq.com/course/58689

教室地址：

北京昌平区回龙观东大街地铁8号线A口，向西走100米（紧邻同仁堂）二楼203教室

