<template>
  <div class="search">
    <van-nav-bar placeholder>
      <template #left>
        <van-search
          v-model="keyword"
          placeholder="搜索笔记、商品和用户"
          shape="round"
          @search="onSearch"
          @clear="onClear"
        />
      </template>
      <template #right>
        <span @click="onCancel">取消</span>
      </template>
    </van-nav-bar>

    <div class="search-content">
      <!-- 搜索建议 -->
      <div v-if="showSuggest" class="suggest">
        <div class="history" v-if="historyList.length">
          <div class="title">
            <span>历史记录</span>
            <van-icon name="delete" @click="clearHistory" />
          </div>
          <div class="tags">
            <van-tag
              v-for="(item, index) in historyList"
              :key="index"
              plain
              round
              size="medium"
              @click="search(item)"
            >
              {{ item }}
            </van-tag>
          </div>
        </div>

        <div class="hot">
          <div class="title">热门搜索</div>
          <div class="tags">
            <van-tag
              v-for="(item, index) in hotList"
              :key="index"
              plain
              round
              type="danger"
              size="medium"
              @click="search(item)"
            >
              {{ item }}
            </van-tag>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-else class="result">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="result-item"
            v-for="item in resultList"
            :key="item.id"
            @click="goDetail(item.id)"
          >
            <div class="info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <div class="meta">
                <span>{{ item.likes }}点赞</span>
              </div>
            </div>
            <van-image
              v-if="item.image"
              :src="item.image"
              width="80"
              height="80"
              radius="4"
            />
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSearchSuggest, getSearchResult } from '@/api/search'

export default {
  setup() {
    const router = useRouter()
    const keyword = ref('')
    const showSuggest = ref(true)
    const historyList = ref(['口红', '旅游攻略', '穿搭'])
    const hotList = ref([])
    const resultList = ref([])
    const loading = ref(false)
    const finished = ref(false)

    const fetchHotSuggest = async () => {
      try {
        const res = await getSearchSuggest()
        hotList.value = res.list
      } catch (error) {
        console.error('获取热门搜索失败:', error)
      }
    }

    const fetchSearchResult = async () => {
      if (!keyword.value) return

      loading.value = true
      try {
        const res = await getSearchResult({ keyword: keyword.value })
        resultList.value = res.list
        // 添加到历史记录
        if (!historyList.value.includes(keyword.value)) {
          historyList.value.unshift(keyword.value)
        }
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        loading.value = false
        finished.value = true
      }
    }

    const onSearch = () => {
      if (!keyword.value) return
      showSuggest.value = false
      resultList.value = []
      finished.value = false
      fetchSearchResult()
    }

    const onClear = () => {
      showSuggest.value = true
    }

    const onCancel = () => {
      router.back()
    }

    const search = word => {
      keyword.value = word
      onSearch()
    }

    const clearHistory = () => {
      historyList.value = []
    }

    const goDetail = id => {
      router.push(`/detail/${id}`)
    }

    const onLoad = () => {
      // 模拟加载更多
      setTimeout(() => {
        fetchSearchResult()
      }, 1000)
    }

    onMounted(() => {
      fetchHotSuggest()
    })

    return {
      keyword,
      showSuggest,
      historyList,
      hotList,
      resultList,
      loading,
      finished,
      onSearch,
      onClear,
      onCancel,
      search,
      clearHistory,
      goDetail,
      onLoad
    }
  }
}
</script>

<style scoped>
.search {
  height: 100vh;
  background: #fff;
}

.search-content {
  padding: 10px;
}

.van-nav-bar {
  --van-nav-bar-height: 54px;
}

.van-search {
  padding: 0;
  width: 280px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0 10px;
  font-size: 14px;
  color: #999;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}

.van-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.result-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.result-item .info {
  flex: 1;
  padding-right: 10px;
}

.result-item h3 {
  font-size: 16px;
  margin: 0 0 5px;
  color: #333;
}

.result-item p {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.result-item .meta {
  font-size: 12px;
  color: #999;
}
</style>