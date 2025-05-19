import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock';

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({
      supportTs: true, // 启用 TypeScript 支持
      mockPath: 'mock', // mock 数据文件的路径
      localEnabled: true, // 是否启用本地 mock 服务
      prodEnabled: true, // 生产环境是否启用 mock 服务
      watchFiles: true, // 是否监听文件变化并实时重新加载 mock 数据
    })
    // VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: "dist", // 指定输出路径
    assetsDir: "assets", // 指定生成静态资源的存放路径
    minify: "terser", // 混淆器,terser构建后文件体积更小
    sourcemap: false, //是否构建source map 文件
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true, // 生产环境移除debugger
      },
    },
  },
  // server: {
  //   port: 8080,
  //   host: true,
  //   open: true,
  //   proxy: {
  //     // https://cn.vitejs.dev/config/#server-proxy
  //     '/api': {
  //       // target: 'http://192.168.50.149:9999/dev-api/',
  //       target: 'https://www.eagletrader.com.cn/',
  //       // target: 'http://192.168.50.231:8080/',
  //       ws: true,
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (p) => p.replace(/^\/dev-api/, '')
  //     }
  //   }
  // },
})
