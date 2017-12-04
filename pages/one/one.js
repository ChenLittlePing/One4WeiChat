// one.js
import api from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayId: [], //列表ID
    oneList: [], //不同日期列表
    playingMusicUrl: '' //正在播放的音乐路径或者ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDayId()
    this.listenerMusicPlayPauseState()
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
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  getDayId: function () {
    var that = this

    api.getOneListId({
      success(res) {
        that.setData({
          dayId: res.data.data
        })
        that.getList(that.data.dayId[0])
      }
    })
  },

  getList: function (id) {
    var that = this
    api.getOneList({
      id: id,
      success(res) {
        that.setData({
          weather: res.data.data.weather,
          oneList: that.data.oneList.concat(res.data.data)
        })
      }
    })
  },

  playOrPauseMusic: function (event) {
    var that = this
    that.data.playingMusicUrl = event.currentTarget.dataset.url
    if (!isNaN(parseInt(that.data.playingMusicUrl))) {
      api.getXiaMiMusic({
        id: that.data.playingMusicUrl,
        success(res) {
          that.checkMusicPlayerState(res.data.url)
        }
      })
    } else {
      that.checkMusicPlayerState(that.data.playingMusicUrl)
    }
  },

  checkMusicPlayerState(url) {
    var that = this
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status
        var dataUrl = res.dataUrl
        var currentPosition = res.currentPosition
        var duration = res.duration
        var downloadPercent = res.downloadPercent
        if (url === dataUrl) {
          if (status === 2) {
            that.playMusic(url)
          } else if (status ===1) {
            that.pauseMusic()
          } else if (status === 0) {
            that.playMusic(url)
          }
        } else {
          that.playMusic(url)
        }
      },
      fail: function (res) {
        that.playMusic(url)
      }
    })
  },

  playMusic(src) {
    var that = this
    wx.showLoading({
      title: '正在加载...',
    })
    wx.playBackgroundAudio({
      //播放地址  
      dataUrl: src,
      title: '',
      //图片地址  
      coverImgUrl: '',
      success: function (res) {
        wx.hideLoading()
        that.setData({
          playingMusicUrl: that.data.playingMusicUrl
        })
      },
      fail: function (res) {
        console.debug('播放失败')
        wx.showToast({
          title: '加载失败...',
        })
        that.setData({
          playingMusicUrl: ''
        })
      }
    })
  },

  pauseMusic() {
    wx.pauseBackgroundAudio();
  },

  listenerMusicPlayPauseState() {
    var that = this
    
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        playingMusicUrl: that.data.playingMusicUrl
      })
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        playingMusicUrl: ''
      })
    })
    wx.onBackgroundAudioStop(function () {
      that.setData({
        playingMusicUrl: ''
      })
    })
  },

  pageChange: function(event) {
    var index = event.detail.current
    if (index >= this.data.oneList.length) {
      this.getList(this.data.dayId[event.detail.current])
    }
  },

  gotoDetail: function (event) {
    var title = event.currentTarget.dataset.title
    var category = event.currentTarget.dataset.category
    var item_id = event.currentTarget.dataset.item_id
    var source_id = event.currentTarget.dataset.source_id
    wx.navigateTo({
      url: '../reading-detail/reading-detail?category=' + category + '&item_id=' + item_id + '&source_id=' + source_id + '&title=' + title
    })
  }
})