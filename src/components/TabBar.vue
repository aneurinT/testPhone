<template>
  <van-tabbar v-model="active" route fixed placeholder>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/search">发现</van-tabbar-item>
    <van-tabbar-item icon="plus" to="/publish">发布</van-tabbar-item>
    <van-tabbar-item icon="chat-o" to="/message">消息</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const active = ref(0)

    // 根据路由设置active
    const path = route.path
    if (path === '/') active.value = 0
    else if (path === '/search') active.value = 1
    else if (path === '/publish') active.value = 2
    else if (path === '/message') active.value = 3
    else if (path === '/profile') active.value = 4

    return { active }
  }
}
</script>