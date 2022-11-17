<script setup lang="ts">
import {
  reactive,
  onMounted,
  ref,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
import axios from "../utils/axios";
import AddSwiper from "@/components/AddSwiper.vue";
import { ElMessage } from "element-plus";

const app = getCurrentInstance() as ComponentInternalInstance;
const { goTop } = app.appContext.config.globalProperties;

const addSwiperRef = ref();

const state = reactive({
  tableData: [],
  loadingContral: false,
  pageNumber: 1, //当前的页数
  pageSum: 10, // 每页的请求数
  type: "add",
  multipleSelection: [],
  total: 0, //总共请求数
});

const handleAdd = () => {
  console.log("addSwiper", addSwiperRef.value);
  state.type = "add";
  addSwiperRef.value.open();
};

const handleEdit = (id: string) => {
  state.type = "edit";
  addSwiperRef.value.open(id);
};

const handleSelection = (val: any) => {
  state.multipleSelection = val;
  console.log(state.multipleSelection);
};

const handleCurrentPage = (val: number) => {
  state.pageNumber = val;
  getTableData();
};

const handleDelete = () => {
  if (!state.multipleSelection.length) {
    ElMessage.error("请选择项");
    return;
  } else {
    axios
      .delete("/carousels", {
        data: {
          ids: state.multipleSelection.map((i: any) => i.carouselId),
        },
      })
      .then(() => {
        ElMessage.success("删除成功");
        getTableData();
      });
  }
};

const getTableData = () => {
  state.loadingContral = true;
  axios
    .get("/carousels", {
      params: {
        pageNumber: state.pageNumber,
        pageSize: state.pageSum,
      },
    })
    .then((res: any) => {
      state.loadingContral = false;
      state.tableData = res.list;
      state.total = res.totalCount;
      state.pageNumber = res.currPage;
      goTop && goTop();
    });
};

onMounted(() => {
  getTableData();
});
</script>

<template>
  <el-card class="swiper-content">
    <template #header>
      <el-card class="swiper-header" style="margin-bottom: 20px">
        <div class="header">
          <el-button type="primary" size="small" @click="handleAdd">
            增加
          </el-button>
          <el-popconfirm
            title="确定删除吗"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete"
          >
            <template #reference>
              <el-button type="danger" size="small">批量删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-card>
    </template>

    <el-table
      :data="state.tableData"
      v-loading="state.loadingContral"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="轮播图" width="200">
        <template #default="scope">
          <img
            :src="scope.row.carouselUrl"
            alt="轮播图"
            style="width: 150px; height: 150px"
          />
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" width="500">
        <template #default="scope">
          <a :href="scope.row.redirectUrl" target="_blank">{{
            scope.row.redirectUrl
          }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="排序值"
        width="200"
        prop="carouselRank"
      ></el-table-column>
      <el-table-column
        label="添加事件"
        width="300"
        prop="createTime"
      ></el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :page-size="state.pageSum"
      v-model:current-page="state.pageNumber"
      @current-change="handleCurrentPage"
      :page-count="state.total"
      background="true"
      style="margin-top: 10px"
    >
    </el-pagination>
  </el-card>
  <add-swiper
    ref="addSwiperRef"
    :type="state.type"
    :reload="getTableData"
  ></add-swiper>
</template>

<style scoped lang="less"></style>
