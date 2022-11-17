<script setup lang="ts">
import Header from "./components/Header.vue";
import Foot from "./components/Foot.vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { localGet, pathMap } from "./utils/index";

const router = useRouter();

const state = reactive({
  showMenu: true,
  defaultOpen: ["1", "2", "3"],
  currentPath: "/index",
});

const noMenu = ["/login"];

router.beforeEach(async (to, from, next) => {
  if (to.path === "/login" || localGet("token")) {
    next();
  } else {
    next({ path: "/login" });
  }

  state.showMenu = !noMenu.includes(to.path);
  state.currentPath = to.path;
  document.title = pathMap[to.name as string];
});
</script>

<template>
  <div>
    <div class="layout">
      <el-container class="container">
        <el-aside width="200px" class="aside" v-if="state.showMenu">
          <div class="head">
            <img src="//s.weituibao.com/1582958061265/mlogo.png" alt="logo" />
            <span>vue3 admin</span>
          </div>
          <!-- 为了美观的线条 -->
          <div class="line"></div>
          <!-- 菜单 -->
          <el-menu
            :default-openeds="state.defaultOpen"
            :default-active="state.currentPath"
            background-color="#222832"
            text-color="#fff"
            :router="true"
          >
            <el-sub-menu index="1">
              <!-- 一级栏目 -->
              <template #title>
                <span>骗钱商城</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/index"
                  ><el-icon><Odometer /></el-icon>首页</el-menu-item
                >
              </el-menu-item-group>

              <el-sub-menu index="2">
                <template #title>
                  <span>首页配置</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/swiper">
                    <el-icon><PictureFilled /></el-icon>轮播图配置
                  </el-menu-item>
                  <el-menu-item index="/hot"
                    ><el-icon><StarFilled /></el-icon>热销商品配置</el-menu-item
                  >
                  <el-menu-item index="/new"
                    ><el-icon><Sell /></el-icon>新品上线配置</el-menu-item
                  >
                  <el-menu-item index="/recommend"
                    ><el-icon><ShoppingCart /></el-icon
                    >为你推荐配置</el-menu-item
                  >
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <span>模块管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/category">
                    <el-icon><Grid /></el-icon> 分类管理
                  </el-menu-item>
                  <el-menu-item index="/good"
                    ><el-icon><Goods /></el-icon>商品管理
                  </el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container class="content">
          <Header></Header>
          <el-main class="main">
            <router-view></router-view>
          </el-main>
          <Foot></Foot>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<style scoped lang="less">
.layout {
  height: 100vh;
  background-color: #ffffff;

  .container {
    height: 100vh;

    .aside {
      width: 200px;
      background-color: #222832;

      .head {
        display: flex;
        height: 50px;
        justify-content: center;
        align-items: center;

        img {
          width: 20%;
          height: 50px;
          margin-right: 5%;
        }

        span {
          font-size: 20px;
          color: #ffffff;
        }
      }

      .line {
        border-top: 1px solid rgb(28, 26, 26);
        border-bottom: 1px solid rgb(34, 27, 27);
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      height: 100vh;

      .main {
        height: 100vh;
        padding: 10px;
      }
    }
  }
}
</style>
