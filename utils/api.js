var base_url = 'http://v3.wufazhuce.com:8000/api/'
var uuid = 'uuid=ffffffff-a90e-706a-63f7-ccf973aae5ee'
var channel = '&channel=wdj'
var version = '&version=4.0.2'
var platform = '&platform=android'
var must = uuid + channel + version + platform

const wxRequest = function (params, url) {
  wx.request({
    url: url,
    header: {
      'Content-Type': 'application/json'
    },
    method: params.method | 'GET',
    success: function (res) {
      params.success && params.success(res)
    },
    fail: function (res) {
      params.fail && params.fail(res)
    },
    complete: function (res) {
      params.complete && params.complete(res)
    },
  })
}

const getOneListId = (params) => wxRequest(params, base_url + 'onelist/idlist/?' + must)

const getOneList = (params) => wxRequest(params, base_url + 'onelist/' + params.id + '/0?' + must)

const getEssayDetail = (params) => wxRequest(params, base_url + 'essay/' + params.item_id + "?source=summary&source_id=" + params.source_id + "&" + must)

const getSerialContent = (params) => wxRequest(params, base_url + 'serialcontent/' + params.item_id)

const getMovieDetail = (params) => wxRequest(params, 'http://v3.wufazhuce.com:8000/api/movie/' + params.item_id + '/story/1/0?'+ must)

const getXiaMiMusic = (params) => wxRequest(params, 'http://xiamirun.avosapps.com/run?song=http://www.xiami.com/song/'+params.id)

module.exports = {
  getOneListId,
  getOneList,
  getEssayDetail,
  getSerialContent,
  getMovieDetail,
  getXiaMiMusic
}