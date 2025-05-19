<template>
  <div class="waterfall-container">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      success-text="刷新成功"
    >
      <!-- 瀑布流列表 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="waterfall" ref="waterfallRef">
          <div class="column" v-for="(column, index) in columns" :key="index">
            <div class="item" v-for="item in column" :key="item.id">
              <!-- 图片内容 -->
              <template v-if="item.type === 'image'">
                <img
                  :src="item.url"
                  :alt="item.title"
                  @error="handleImageError(item)"
                  class="content-media"
                  @click="handleImageClick(item)"
                />
                <div v-if="item.loadError" class="media-error">
                  <van-icon name="photo-fail" size="24" />
                  <span>图片加载失败</span>
                </div>
              </template>

              <!-- 视频内容 -->
              <template v-else-if="item.type === 'video'">
                <div class="video-wrapper" @click="handleVideoClick(item)">
                  <img
                    :src="item.poster"
                    class="video-poster"
                    :alt="item.title"
                    @error="handlePosterError(item)"
                  />
                  <div class="video-play-icon">
                    <van-icon name="play-circle-o" size="40" />
                  </div>
                  <div class="video-duration">
                    {{ formatDuration(item.duration) }}
                  </div>
                  <div v-if="item.loadError" class="media-error">
                    <van-icon name="video-fail" size="24" />
                    <span>视频加载失败</span>
                  </div>
                </div>
              </template>

              <div class="item-content">
                <h3 class="item-title">{{ item.title }}</h3>
                <p class="item-desc">{{ item.desc }}</p>
                <div class="item-footer">
                  <van-image
                    round
                    width="24"
                    height="24"
                    :src="item.avatar"
                    class="author-avatar"
                  />
                  <span class="author-name">{{ item.author }}</span>
                  <span class="likes">
                    <van-icon name="like-o" /> {{ formatNumber(item.likes) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 视频弹窗 -->
    <van-popup
      v-model:show="showVideoPopup"
      round
      closeable
      close-icon="close"
      position="center"
      :style="{ width: '90%', height: '70%' }"
      @close="closeVideoPopup"
    >
      <div class="video-popup-content">
        <video
          ref="videoPlayer"
          controls
          autoplay
          :src="currentVideo?.url"
          :poster="currentVideo?.poster"
          class="popup-video"
          @ended="onVideoEnded"
        ></video>
        <div class="video-popup-info">
          <h3>{{ currentVideo?.title }}</h3>
          <div class="video-popup-footer">
            <van-image
              round
              width="32"
              height="32"
              :src="currentVideo?.avatar"
              class="author-avatar"
            />
            <span class="author-name">{{ currentVideo?.author }}</span>
            <span class="likes">
              <van-icon name="like-o" />
              {{ formatNumber(currentVideo?.likes || 0) }}
            </span>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 图片预览弹窗 -->
    <van-image-preview
      v-model:show="showImagePreview"
      :images="previewImages"
      :start-position="previewIndex"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { List, PullRefresh, Icon, Image, Popup, ImagePreview } from 'vant'

// 测试数据源
const TEST_IMAGES = Array.from(
  { length: 30 },
  (_, i) => `https://picsum.photos/300/400?random=${i + 1}`
)

const TEST_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-feeding-a-white-duck-1125-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-red-frog-on-a-log-1487-large.mp4'
]

const TEST_AVATARS = Array.from(
  { length: 10 },
  (_, i) =>
    `https://randomuser.me/api/portraits/${
      Math.random() > 0.5 ? 'men' : 'women'
    }/${i + 1}.jpg`
)

// 响应式数据
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const listData = ref([])
const page = ref(1)
const pageSize = 10

// 视频弹窗相关
const showVideoPopup = ref(false)
const currentVideo = ref(null)
const videoPlayer = ref(null)

// 图片预览相关
const showImagePreview = ref(false)
const previewImages = ref([])
const previewIndex = ref(0)

// 瀑布流相关
const waterfallRef = ref(null)
const columnCount = computed(() => {
  if (!waterfallRef.value) return 2
  const width = waterfallRef.value.offsetWidth
  return width > 600 ? 3 : width > 300 ? 2 : 1
})

// 模拟数据
const mockData = (page, pageSize) => {
  const data = []
  const startIndex = (page - 1) * pageSize

  for (let i = 0; i < pageSize; i++) {
    const isVideo = Math.random() > 0.8 // 20%概率生成视频
    const height = 300 + Math.random() * 300
    const id = startIndex + i
    const avatar = TEST_AVATARS[Math.floor(Math.random() * TEST_AVATARS.length)]

    if (isVideo) {
      data.push({
        id,
        type: 'video',
        title: `有趣的视频 ${id}`,
        desc: `这是我在旅行中拍摄的有趣视频 #旅行 #风景`,
        url: TEST_VIDEOS[Math.floor(Math.random() * TEST_VIDEOS.length)],
        poster: TEST_IMAGES[Math.floor(Math.random() * TEST_IMAGES.length)],
        duration: Math.floor(10 + Math.random() * 180),
        author: `用户${Math.floor(1000 + Math.random() * 9000)}`,
        likes: Math.floor(Math.random() * 10000),
        height,
        avatar,
        loadError: false
      })
    } else {
      data.push({
        id,
        type: 'image',
        title: `美丽的风景 ${id}`,
        desc: `分享今日见到的美丽风景 🌄 #摄影 #风景`,
        url: TEST_IMAGES[Math.floor(Math.random() * TEST_IMAGES.length)],
        author: `用户${Math.floor(1000 + Math.random() * 9000)}`,
        likes: Math.floor(Math.random() * 10000),
        height,
        avatar,
        loadError: false
      })
    }
  }

  return data
}

// 加载更多数据
const onLoad = () => {
  if (refreshing.value) {
    listData.value = []
    refreshing.value = false
  }

  setTimeout(() => {
    const newData = mockData(page.value, pageSize)
    listData.value = [...listData.value, ...newData]
    loading.value = false
    page.value++

    // 模拟数据加载完毕
    if (page.value > 5) {
      finished.value = true
    }
  }, 800)
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  page.value = 1
  onLoad()
}

// 处理视频点击
const handleVideoClick = item => {
  if (item.loadError) return

  currentVideo.value = item
  showVideoPopup.value = true

  // 在弹窗打开后自动播放视频
  setTimeout(() => {
    if (videoPlayer.value) {
      videoPlayer.value.play().catch(err => {
        console.error('视频播放失败:', err)
      })
    }
  }, 300)
}

// 关闭视频弹窗
const closeVideoPopup = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
  showVideoPopup.value = false
}

// 视频播放结束
const onVideoEnded = () => {
  // 可以在这里添加播放结束后的逻辑
  console.log('视频播放结束')
}

// 处理图片点击
const handleImageClick = item => {
  if (item.loadError) return

  // 准备所有图片用于预览
  previewImages.value = listData.value
    .filter(i => i.type === 'image' && !i.loadError)
    .map(i => i.url)

  // 找到当前点击图片的索引
  previewIndex.value = previewImages.value.findIndex(url => url === item.url)
  showImagePreview.value = true
}

// 处理视频加载错误
const handleVideoError = item => {
  console.error(`视频 ${item.id} 加载失败`)
  item.loadError = true
}

// 处理图片加载错误
const handleImageError = item => {
  console.error(`图片 ${item.id} 加载失败`)
  item.loadError = true
}

// 处理封面图加载错误
const handlePosterError = item => {
  console.error(`封面图 ${item.id} 加载失败`)
  item.poster = 'https://placehold.co/600x400?text=封面加载失败'
}

// 格式化视频时长
const formatDuration = seconds => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 格式化数字 (如 1000 -> 1k)
const formatNumber = num => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

// 瀑布流列数据
const columns = computed(() => {
  const cols = Array.from({ length: columnCount.value }, () => [])

  listData.value.forEach(item => {
    // 找出当前最短的列
    let shortestColIndex = 0
    let shortestHeight = cols[0].reduce((sum, i) => sum + i.height, 0)

    for (let i = 1; i < cols.length; i++) {
      const colHeight = cols[i].reduce((sum, i) => sum + i.height, 0)
      if (colHeight < shortestHeight) {
        shortestHeight = colHeight
        shortestColIndex = i
      }
    }

    cols[shortestColIndex].push(item)
  })

  return cols
})

// 初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑
})

onUnmounted(() => {
  // 清理资源
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
})
</script>

<style scoped>
.waterfall-container {
  padding: 8px;
  height: 100vh;
  overflow: auto;
  background-color: #f7f8fa;
}

.waterfall {
  display: flex;
  gap: 8px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.content-media {
  width: 100%;
  display: block;
  background-color: #f5f5f5;
  cursor: pointer;
}

/* 图片样式 */
.item img {
  aspect-ratio: 3/4;
  object-fit: cover;
}

/* 视频容器 */
.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background-color: #000;
  cursor: pointer;
}

.video-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
}

.video-duration {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* 内容区域 */
.item-content {
  padding: 12px;
}

.item-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  margin: 0 0 12px;
  color: #666;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.item-footer {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.author-avatar {
  margin-right: 6px;
}

.author-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.likes {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.likes .van-icon {
  margin-right: 2px;
}

/* 错误提示 */
.media-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 12px;
  padding: 20px;
  text-align: center;
}

.media-error .van-icon {
  margin-bottom: 8px;
}

/* 视频弹窗样式 */
.video-popup-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-video {
  width: 100%;
  flex: 1;
  background-color: #000;
}

.video-popup-info {
  padding: 12px;
  background-color: #fff;
}

.video-popup-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.video-popup-footer {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.video-popup-footer .author-avatar {
  margin-right: 8px;
}

.video-popup-footer .author-name {
  flex: 1;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .waterfall {
    gap: 6px;
  }

  .column {
    gap: 6px;
  }

  .item-content {
    padding: 10px;
  }

  .item-title {
    font-size: 14px;
  }

  .item-desc {
    font-size: 12px;
  }
}
</style>