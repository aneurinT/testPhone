import Mock from 'mockjs'

// 模拟用户数据
Mock.mock('/api/user', 'get', {
  'id': '@id',
  'username': '@name',
  'avatar': '@image("100x100", "#50B347", "#FFF", "avatar")',
  'fansCount': '@integer(100, 10000)',
  'followCount': '@integer(10, 1000)',
  'likesCount': '@integer(100, 5000)'
})

// 模拟首页帖子列表
Mock.mock('/api/getList', 'get', {
  'list|0-10': [{
    'id': '@id',
    'title': '@ctitle(10, 30)',
    'content': '@cparagraph(1, 3)',
    'images|1-9': ['@image("375x375", "#50B347", "#FFF", "Mock图片")'],
    'user': {
      'name': '@cname',
      'avatar': '@image("50x50", "#50B347", "#FFF", "avatar")'
    },
    'likes': '@integer(0, 10000)',
    'comments': '@integer(0, 1000)',
    'isLiked': '@boolean',
    'time': '@datetime("yyyy-MM-dd HH:mm")'
  }]
})

// 模拟搜索建议
Mock.mock('/api/search/suggest', 'get', {
  'list|5-10': ['@ctitle(2, 5)']
})

// 模拟搜索结果
Mock.mock('/api/search/result', 'get', {
  'list|10-20': [{
    'id': '@id',
    'title': '@ctitle(10, 30)',
    'desc': '@cparagraph(1, 3)',
    'image': '@image("100x100", "#50B347", "#FFF", "Mock图片")',
    'likes': '@integer(0, 10000)'
  }]
})