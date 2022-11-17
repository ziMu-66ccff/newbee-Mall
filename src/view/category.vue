<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "@/utils/axios";
import addCategory from "@/components/addCategory.vue";

const router = useRouter();
const route = useRoute();

const addCategoryRef = ref();

const state = reactive({
  loadingContral: false,
  tableData: [],
  multipleSelection: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  level: 1,
  parentId: 0,
  type: "add",
});

const getCategory = () => {
  const { level = 1, parent_id = 0 } = route.query;
  state.loadingContral = true;
  axios
    .get("/categories", {
      params: {
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
        categoryLevel: level,
        parentId: parent_id,
      },
    })
    .then((res: any) => {
      state.tableData = res.list;
      state.total = res.totalCount;
      state.currentPage = res.currPage;
      state.level = level as number;
      state.parentId = parent_id as number;
    });
};

const handleAdd = () => {
  state.type = "add";
  addCategoryRef.value.open();
};
const handleEdit = (id: any) => {
  state.type = "edit";
  addCategoryRef.value.open();
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};
const changePage = () => {
  getCategory();
};

// 批量删除
const handleDelete = () => {
  if (!state.multipleSelection.length) {
    ElMessage.error("请选择项");
    return;
  }
  axios
    .delete("/categories", {
      data: {
        ids: state.multipleSelection.map((i: any) => i.categoryId),
      },
    })
    .then(() => {
      ElMessage.success("删除成功");
      getCategory();
    });
};
// 单个删除
const handleDeleteOne = (id: any) => {
  axios
    .delete("/categories", {
      data: {
        ids: [id],
      },
    })
    .then(() => {
      ElMessage.success("删除成功");
      getCategory();
    });
};

const handleNext = (item: any) => {
  const nextLevel = item.categoryLevel + 1;
  if (nextLevel === 4) {
    ElMessage.error("不存在分类四级管理");
    return;
  } else {
    router.push({
      name: `level${nextLevel}`,
      query: {
        level: nextLevel,
        parent_id: item.categoryLevel,
      },
    });
  }
};

router.afterEach((to) => {
  if (["category", "level2", "level3"].includes(to.name as string)) {
    getCategory();
  }
});

onMounted(() => {
  getCategory();
});
</script>

<template>
  <el-card class="category-container">
    <template #header>
      <el-button type="primary" @click="handleAdd">增加分类</el-button>
      <ElPopconfirm
        @confirm="handleDelete"
        title="确认删除吗"
        confirm-button-text="确认"
        cancel-button-text="取消"
      >
        <template #reference>
          <el-button type="danger">批量删除</el-button>
        </template>
      </ElPopconfirm>
    </template>
    <el-table :data="state.tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"> </el-table-column>
      <el-table-column label="排序值" prop="categoryRank"></el-table-column>
      <el-table-column label="添加时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit"
            >修改</a
          >
          <a
            style="cursor: pointer; margin-right: 10px"
            @click="handleNext(scope.row)"
            >下级分类</a
          >
          <ElPopconfirm
            title="确认删除吗？"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDeleteOne(scope.row.categoryId)"
          >
            <template #reference>
              <a style="cursor: pointer">删除</a>
            </template>
          </ElPopconfirm>
        </template>
      </el-table-column>
    </el-table>

    <addCategory
      ref="addCategoryRef"
      :type="state.type"
      :reload="getCategory"
    ></addCategory>

    <el-pagination
      background
      :total="state.total"
      v-model:current-page="state.currentPage"
      :page-size="state.pageSize"
      @current-change="changePage"
      layout="prev, pager, next"
      style="margin-top: 10px"
    ></el-pagination>
  </el-card>
</template>

<style scoped lang="less"></style>
