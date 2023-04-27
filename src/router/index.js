import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

import store from "@/store";

const router = createRouter({
  history: createWebHashHistory(),  // hash 模式
  routes: [
    {
      path: "/",
      name: "Portal",
      component: defineAsyncComponent(() => import(`../views/portal`)),
      meta: {
        title: "portal",
      },
      redirect: 'User',
      children: [
        {
          path: 'user',
          name: 'User',
          component: defineAsyncComponent(() => import(`../views/portal/_modules/user`)),
          meta: {
            title: 'user',
          },
        },
        {
          path: 'device',
          name: 'Device',
          component: defineAsyncComponent(() => import(`../views/portal/_modules/device`)),
          meta: {
            title: 'device',
          },
        },
        {
          path: 'discover',
          name: 'Discover',
          component: defineAsyncComponent(() => import(`../views/portal/_modules/discover`)),
          meta: {
            title: 'discover',
          },
        },
        {
          path: 'assets',
          name: 'Assets',
          component: defineAsyncComponent(() => import(`../views/portal/assets`)),
          meta: {
            title: 'assets',
          },
        },
        {
          path: 'appWindow',
          name: 'AppWindow',
          component: defineAsyncComponent(() => import(`../views/appWindow`)),
          meta: {
            title: 'appWindow',
            keepAlive: true
          },
        },

      ]
    },
    {
      path: "/detailFog",
      name: "DetailFog",
      component: defineAsyncComponent(() => import(`../views/fogDetail`)),
      meta: {
        title: "detailFog",
      },
    },
    {
      path: '/Alltemplate',
      name: 'Alltemplate',
      redirect: '/Alltemplate/Home',
      component: defineAsyncComponent(() => import(`../views/Alltemplate/Alltemplate.vue`)),
      children: [
        {
          path: 'Home',
          name: 'Home',
          component: () => defineAsyncComponent(() => import(`@/views/Alltemplate/Home/Home.vue`)),
          meta: { title: '首页', headerRoute: 'Home' }
        },
        {
          path: 'Orders',
          name: 'Orders',
          component: () => defineAsyncComponent(() => import(`@/views/Alltemplate/Orders/orders.vue`)),
          meta: { title: '订单', headerRoute: 'Orders' }
        },
        {
          path: 'MyFiles',
          name: 'MyFiles',
          component: () => defineAsyncComponent(() => import(`@/views/Alltemplate/MyFiles/myFiles.vue`)),
          meta: { title: 'myFiles', headerRoute: 'Orders' }
        },

        {
          path: 'Storage',
          name: 'Storage',
          component: () => defineAsyncComponent(() => import(`@/views/Alltemplate/Storage/Storage.vue`)),
          meta: { title: '存储空间', headerRoute: 'Storage' }
        },

      ]
    },
    {
      path: "/*",
      redirect: "/",
    },
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {

  if (to.meta.title) {
    localStorage.setItem("headerRoute", to.meta.headerRoute);

    // store.commit('global/setActiveIndex', to.meta.headerRoute)
    document.title = 'Foggie Portal';
  }
  next()
})

router.afterEach((to, from) => {
  // console.log(to, from)
  // console.log('afterEach')
})

export default router