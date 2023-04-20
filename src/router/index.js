import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { defineAsyncComponent } from "vue";

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  // history: createWebHistory(),  // history 模式
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
      path: "/*",
      redirect: "/",
    },
  ],
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.meta.title) {
    // document.title = `${to.meta.title}`;
    document.title = "Foggie Portal";
  }
  next();
});

router.afterEach((to, from) => {
  console.log(to, from);
  // console.log('afterEach')
});

export default router;
