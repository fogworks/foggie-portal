import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { defineAsyncComponent } from "vue";

import store from "@/store";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Portal",
      component: defineAsyncComponent(() => import(`../views/portal`)),
      meta: {
        title: "portal",
      },
      redirect: "User",
      children: [
        {
          path: "user",
          name: "User",
          component: defineAsyncComponent(() =>
            import(`../views/portal/user/index`)
          ),
          meta: {
            title: "user",
          },
        },
        {
          path: "device",
          name: "Device",
          component: defineAsyncComponent(() =>
            import(`../views/portal/_modules/device`)
          ),
          meta: {
            title: "device",
          },
        },
        {
          path: "discover",
          name: "Discover",
          component: defineAsyncComponent(() =>
            import(`../views/portal/_modules/discover`)
          ),
          meta: {
            title: "discover",
          },
        },
        {
          path: "assets",
          name: "Assets",
          component: defineAsyncComponent(() =>
            import(`../views/portal/assets`)
          ),
          meta: {
            title: "assets",
          },
        },
        {
          path: "shop",
          name: "Shop",
          component: defineAsyncComponent(() => import(`../views/portal/shop`)),
          meta: {
            title: "shop",
          },
        },
        {
          path: "appWindow",
          name: "AppWindow",
          component: defineAsyncComponent(() => import(`../views/appWindow`)),
          meta: {
            title: "appWindow",
            keepAlive: true,
          },
        },
      ],
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
      path: "/Alltemplate",
      name: "Alltemplate",
      redirect: "/Alltemplate/Home",
      component: defineAsyncComponent(() =>
        import(`../views/Alltemplate/Alltemplate.vue`)
      ),
      children: [
        {
          path: "Home",
          name: "Home",
          component: () =>
            defineAsyncComponent(() =>
              import(`@/views/Alltemplate/Home/Home.vue`)
            ),
          meta: { title: "Front Page", headerRoute: "Home" },
        },
        {
          path: "Orders",
          name: "Orders",
          component: () =>
            defineAsyncComponent(() =>
              import(`@/views/Alltemplate/Orders/orders.vue`)
            ),
          meta: { title: "Order", headerRoute: "Orders" },
        },
        {
          path: "MyFiles",
          name: "MyFiles",
          component: () =>
            defineAsyncComponent(() =>
              import(`@/views/Alltemplate/MyFiles/myFiles.vue`)
            ),
          meta: { title: "MyFiles", headerRoute: "Orders" },
        },

        {
          path: "Storage",
          name: "Storage",
          component: () =>
            defineAsyncComponent(() =>
              import(`@/views/Alltemplate/Storage/Storage.vue`)
            ),
          meta: { title: "Storage", headerRoute: "Storage" },
        },
      ],
    },
    {
      path: "/*",
      redirect: "/",
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    localStorage.setItem("headerRoute", to.meta.headerRoute);

    // store.commit('global/setActiveIndex', to.meta.headerRoute)
    document.title = "Foggie Portal";
  }
  if (!store.getters.hasReady) {
    if (to.name !== 'User' && to.name !== 'Discover') {
      next({ name: 'User' })
    } else {
      next()
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => { });

export default router;
