<template>
  <div class="post-card">
    <div class="post-header">
      <img :src="post.user.avatar" class="avatar" />
      <span class="username">{{ post.user.name }}</span>
      <van-button size="mini" class="follow-btn">关注</van-button>
    </div>

    <div class="post-content">
      <p class="title">{{ post.title }}</p>
      <p class="desc">{{ post.content }}</p>

      <div class="images" v-if="post.images.length">
        <van-image
          v-for="(img, index) in post.images"
          :key="index"
          :src="img"
          lazy-load
        />
      </div>
    </div>

    <div class="post-footer">
      <div class="action" @click="toggleLike">
        <van-icon
          :name="post.isLiked ? 'like' : 'like-o'"
          :color="post.isLiked ? 'red' : ''"
        />
        <span>{{ post.likes }}</span>
      </div>
      <div class="action">
        <van-icon name="comment-o" />
        <span>{{ post.comments }}</span>
      </div>
      <div class="action">
        <van-icon name="share-o" />
      </div>
    </div>
  </div>
</template>

<!-- <script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggleLike() {
      this.$emit('like', this.post.id)
    }
  }
}
</script> -->
<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
onMounted(() => {
  console.log(props.post)
})
</script>

<style scoped>
.post-card {
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.follow-btn {
  padding: 0 10px;
  height: 24px;
  line-height: 22px;
}

.post-content {
  margin-bottom: 10px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.images {
  margin-top: 10px;
}

.images .van-image {
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  overflow: hidden;
}

.post-footer {
  display: flex;
  padding-top: 10px;
}

.action {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: #666;
  font-size: 12px;
}

.action span {
  margin-left: 5px;
}
</style>