import { createRouter, createWebHistory } from 'vue-router'
import Home from '../view/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

  ],
  // scrollBehavior() {
  //   return {
  //     left: 0,
  //     top: 0
  //   }
  // }
})

router.beforeEach((to, from, next) => {
  console.log('Navigating from', from.path, 'to', to.path);
  next();
});

export default router
