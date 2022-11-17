import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () => import("@/view/index.vue"),
    name: "index",
  },
  {
    path: "/login",
    component: () => import("@/view/login.vue"),
    name: "login",
  },
  {
    path: "/swiper",
    component: () => import("@/view/swiper.vue"),
    name: "swiper",
  },
  {
    path: "/hot",
    component: () => import("@/view/indexConfig.vue"),
    name: "hot",
  },
  {
    path: "/recommend",
    component: () => import("@/view/indexConfig.vue"),
    name: "recommend",
  },
  {
    path: "/new",
    component: () => import("@/view/indexConfig.vue"),
    name: "new",
  },
  {
    path: "/category",
    component: () => import("@/view/category.vue"),
    name: "category",
    children: [
      {
        path: "/category/level2",
        component: () => import("@/view/category.vue"),
        name: "level2",
      },
      {
        path: "/category/level3",
        component: () => import("@/view/category.vue"),
        name: "level3",
      },
    ],
  },
  {
    path: "/good",
    component: () => import("@/view/good.vue"),
    name: "good",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
