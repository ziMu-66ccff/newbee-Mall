<script setup lang="ts">
import axios from "../utils/axios";
import type { AxiosResponse } from "axios";
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { pathMap, localRemove } from "../utils/index";

interface headerData {
  name: string;
  userInfo: AxiosResponse<any, any> | any;
  hasBack: boolean;
}

const router = useRouter();

const state: headerData = reactive({
  name: "子木",
  userInfo: null,
  hasBack: false,
});

onMounted(() => {
  const pathName = window.location.hash.split("/")[1] || "";
  if (pathName != "login") {
    getUserInfo();
  }
});

const getUserInfo = async () => {
  const userInfo = await axios.get("/adminUser/profile");
  state.userInfo = userInfo;
};

const logout = () => {
  axios.delete("/logout").then(() => {
    // 退出之后，将本地保存的 token  清理掉
    localRemove("token");
    // 回到登录页
    router.push({ path: "/login" });
  });
};

const back = () => {
  router.back();
};

router.afterEach((to) => {
  const { id } = to.query;
  state.name = pathMap[to.name as string];
  state.hasBack = ["level2", "level3"].includes(to.name as string);
});
</script>

<template>
  <div class="header">
    <div class="left" style="font-size: 20px">
      <el-icon class="back" v-if="state.hasBack" @click="back"
        ><Back
      /></el-icon>
      {{ state.name }}
    </div>
    <div class="right">
      <el-popover
        placement="bottom"
        trigger="click"
        :show-arrow="false"
        width="280px"
      >
        <template #reference>
          <div class="author">
            <el-icon><Avatar /></el-icon>
            {{ (state.userInfo && state.userInfo.nickName) || "" }}
            <el-icon><CaretBottom /></el-icon>
          </div>
        </template>

        <div class="message">
          <div class="userMessage">
            <div class="username">
              登录名：{{
                (state.userInfo && state.userInfo.loginUserName) || ""
              }}
            </div>
            <div class="name">
              昵称：{{ (state.userInfo && state.userInfo.nickName) || "" }}
            </div>
          </div>
          <el-tag type="small" effect="dark" class="out" @click="logout"
            >退出</el-tag
          >
        </div>
      </el-popover>
    </div>
  </div>
</template>

<style scoped lang="less">
.header {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #e9e9e9;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
    .back {
      border: 1px solid #e9e9e9;
      border-radius: 50%;
      padding: 5px;
      margin-right: 10px;
      cursor: pointer;
    }
  }

  .right {
    .author {
      cursor: pointer;
    }
  }
}
</style>

<style lang="less">
.el-popover {
  background: url("https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png")
    50% 50% !important;
  background-size: cover !important;

  .message {
    display: flex;
    justify-content: space-between;
    margin: 12px auto;

    .userMessage {
      font-size: 10px;
      color: azure;

      .username {
        margin-bottom: 5px;
      }
    }
    .out {
      cursor: pointer !important;
    }
  }
}
</style>
