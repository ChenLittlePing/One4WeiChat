// reading-detail.js
var WxParse = require('../../wxParse/wxParse.js')
var api = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: '',
    item_id: '',
    source_id: '',
    article: '',
    title: '',
    author: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.item_id = options.item_id;
    this.data.source_id = options.source_id;
    this.data.category = options.category;
    this.data.title = options.title;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({ title: this.data.title })
    this.getDetail(this.data.category, this.data.item_id, this.data.source_id)
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

  },

  getDetail: function (category, item_id, source_id) {
    var that = this
    if (category == 5) {
      that.getMovieDetail(item_id)
    } else if (category == 2) {
      that.getSerialContent(item_id)
    } else {      
      that.getEssayDetail(source_id, item_id)
    }
  },

  getMovieDetail(item_id) {
    var that = this
    api.getMovieDetail({
      item_id: item_id,
      success(res) {
        that.data.article = res.data.data.data[0].content;
        that.setData({
          title: res.data.data.data[0].title,
          author: res.data.data.data[0].user.user_name
        })
        that.optimizeHtmlDispaly(res);
      }
    })
  },

  getSerialContent(item_id) {
    var that = this
    api.getSerialContent({
      item_id: item_id,
      success(res) {
        that.data.article = res.data.data.content;
        that.setData({
          title: res.data.data.title,
          author: res.data.data.author_list[0].user_name
        })
        that.optimizeHtmlDispaly(res);
      }
    })
  },

  getEssayDetail(source_id, item_id) {
    var that = this
    api.getEssayDetail({
      source_id: source_id,
      item_id: item_id,
      success(res) {
        that.data.article = res.data.data.hp_content;
        that.setData({
          title: res.data.data.hp_title,
          author: res.data.data.hp_author
        })
        that.optimizeHtmlDispaly(res);
      }
    })
  },

  getContentSuccess: function (res) {
    if (this.data.category == 2) {
      this.data.article = res.data.data.content;
      this.setData({
        title: res.data.data.title,
        author: res.data.data.author_list[0].user_name
      })
    } else {
      this.data.article = res.data.data.hp_content;
      this.setData({
        title: res.data.data.hp_title,
        author: res.data.data.hp_author
      })
    }
    this.optimizeHtmlDispaly(res);
  },

  optimizeHtmlDispaly(res) {
    var reg = new RegExp("<div", "g"); //修改字体大小和行距
    this.data.article = this.data.article.replace(reg, '<div style="font-size:30rpx;line-height:60rpx"')

    var reg = new RegExp("<p", "g"); //修改字体大小和行距
    this.data.article = this.data.article.replace(reg, '<p style="font-size:30rpx;line-height:60rpx"')

    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    WxParse.wxParse('article', 'html', this.data.article, this, 0);
    this.setData({
      content: res.data.data,
    })
  }
})