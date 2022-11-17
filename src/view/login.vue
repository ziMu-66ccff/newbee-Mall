<script setup lang="ts">
import axios from "@/utils/axios";
// 安装 js-md5，密码需要 md5 加密，服务端是解密 md5 的形式
import md5 from "js-md5";
import { reactive, ref, toRefs } from "vue";
import { localSet } from "@/utils";
import type { FormInstance } from "element-plus";

let loginForm = ref<FormInstance>();

const state = reactive({
  ruleForm: {
    username: "",
    password: "",
  },
  checked: true,
  rules: {
    username: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "密码不能为空",
        trigger: "blur",
      },
    ],
  },
});

const submitForm = async () => {
  loginForm.value?.validate((valid) => {
    if (valid) {
      axios
        .post("/adminUser/login", {
          userName: state.ruleForm.username || "",
          passwordMd5: md5(state.ruleForm.password),
        })
        .then((res) => {
          localSet("token", res);
          window.location.href = "/";
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

const resetForm = () => {
  loginForm.value?.resetFields();
};
</script>

<template>
  <div class="login-body">
    <div class="login-container">
      <div class="head">
        <img src="https://s.weituibao.com/1582958061265/mlogo.png" alt="" />
        <div class="name">
          <div class="title">新峰商城</div>
          <div class="tips">vue3+ts后台管理系统</div>
        </div>
      </div>

      <el-form
        style="margin: 0px 15%"
        label-position="top"
        :rules="state.rules"
        :model="state.ruleForm"
        ref="loginForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="text"
            placeholder="请输入账号"
            v-model="state.ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="state.ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="font-size: 12px; color: green">
            登录表示您已经同意<a href="#" style="color: #66ccff"
              >《服务条款》</a
            >
          </div>
          <el-button
            type="primary"
            style="width: 100%; height: 36px; margin: 5px 0px"
            @click="submitForm"
            >立即登录</el-button
          >
          <el-checkbox v-model="state.checked">下次自动登录</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: transparent url(../assets/login-bg.svg);

  .login-container {
    width: 400px;
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);

    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 50px 0px 20px 0px;

      img {
        width: 22%;
        height: 100px;
        margin-right: 20px;
      }

      .name {
        .title {
          font-size: 29px;
          text-align: center;
          color: #1baeae;
          font-weight: bold;
        }
        .tips {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>
