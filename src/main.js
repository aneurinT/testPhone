import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import Vant from 'vant';
import axios from 'axios'
import 'vant/lib/index.css';
import { VueMasonryPlugin } from "vue-masonry";

// 开发环境才使用mock
if (process.env.NODE_ENV === 'development') {
  import('./mock/index')
}

const app = createApp(App)
app.use(createPinia())
app.use(Vant);
app.use(VueMasonryPlugin);
app.use(router)
app.provide('$axios', axios)
app.mount('#app')