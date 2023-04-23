import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
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
      path: "/welcome",
      name: "Welcome",
      component: defineAsyncComponent(() => import(`../views/welcome`)),
      meta: {
        title: "welcome",
      },
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