<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { onUnmounted, reactive, ref, onMounted } from "vue";
import axios from "@/utils/axios";
import addGoods from "@/components/addGoods.vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();

const addGoodsRef = ref();

const configTypeMap = {
  hot: 3,
  new: 4,
  recommend: 5,
};

const state = reactive({
  loadingContral: false,
  tableData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  configType: 3,
  type: "add",
  multipleSelection: [],
});

const unWatch = router.beforeEach((to: any) => {
  if (["hot", "new", "recommend"].includes(to.name)) {
    state.configType = configTypeMap[to.name];
    state.currentPage = 1;
    getIndexConfig();
  }
});

onMounted(() => {
  state.configType = configTypeMap[route.name as string];
  getIndexConfig();
});

const getIndexConfig = () => {
  state.loadingContral = true;
  axios
    .get("/indexConfigs", {
      params: {
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
        configType: state.configType,
      },
    })
    .then((res: any) => {
      state.tableData = res.list;
      state.total = res.totalCount;
      state.currentPage = res.currPage;
      state.loadingContral = false;
    });
};

const changePage = (val: number) => {
  getIndexConfig();
};

const handleAdd = () => {
  state.type = "add";
  addGoodsRef.value.open();
};

const handleEdit = (id: string) => {
  state.type = "edit";
  addGoodsRef.value.open(id);
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};

const handleDelete = () => {
  if (!state.multipleSelection.length) {
    ElMessage.error("请选择项");
    return;
  } else {
    axios
      .post("/indexConfigs/delete", {
        ids: state.multipleSelection.map((i: any) => i.configId),
      })
      .then(() => {
        ElMessage.success("删除成功");
        getIndexConfig();
      });
  }
};

const handleDeleteOne = (id: any) => {
  axios
    .post("/indexConfigs/delete", {
      ids: [id],
    })
    .then(() => {
      ElMessage.success("删除成功");
      getIndexConfig();
    });
};

onUnmounted(() => {
  unWatch();
});
</script>

<template>
  <el-card class="indexConfigContent">
    <template #header>
      <el-card class="indexConfigContent">
        <el-button type="primary" size="small" @click="handleAdd"
          >增加商品</el-button
        >
        <ElPopconfirm
          title="确认删除吗"
          confirm-button-text="确认"
          cancel-button-text="取消"
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" size="small">批量删除</el-button>
          </template>
        </ElPopconfirm>
      </el-card>
    </template>

    <el-table
      :data="state.tableData"
      :v-loading="state.loadingContral"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="商品名称" prop="configName"></el-table-column>
      <el-table-column label="跳转链接">
        <template #default="scope">
          <a :href="scope.row.redirectUrl" target="_blank">{{
            scope.row.redirectUrl
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="排序值" prop="configRank"></el-table-column>
      <el-table-column label="商品编号" prop="goodsId"></el-table-column>
      <el-table-column label="添加时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <a
            style="margin-right: 8px; cursor: pointer"
            @click="handleEdit(scope.row.configId)"
            >修改</a
          >
          <ElPopconfirm
            title="确认删除吗?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDeleteOne(scope.row.configId)"
          >
            <template #reference>
              <a style="cursor: pointer">取消</a>
            </template>
          </ElPopconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="state.total"
      :page-svze="state.pageSize"
      v-model:current-page="state.currentPage"
      @current-change="changePage"
      style="margin-top: 10px"
    />
  </el-card>

  <addGoods
    ref="addGoodsRef"
    :type="state.type"
    :configType="state.configType"
    :reload="getIndexConfig"
  ></addGoods>
</template>

<style scoped lang="less"></style>
