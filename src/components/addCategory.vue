<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, FormInstance } from 'element-plus';
import axios from '@/utils/axios';

const props = defineProps({
  type: String,
  reload: Function,
});

const route = useRoute();

const FormRef = ref<FormInstance>();

const state = reactive({
  visible: false,
  categoryLevel: 1,
  parentId: 0,
  ruleForm: {
    name: '',
    rank: '',
  },
  rules: {
    name: [
      {
        required: true,
        message: '名称不能为空',
        trigger: ['change'],
      },
    ],
    rank: [
      {
        required: true,
        message: '序号不能为空',
        trigger: ['change'],
      },
    ],
  },
  id: '',
});

const getDetail = (id: string) => {
  axios.get(`/categories/${id}`).then((res: any) => {
    state.ruleForm = {
      name: res.categoryName,
      rank: res.categoryRank,
    };
    state.parentId = res.parentId;
    state.categoryLevel = res.categoryLevel;
  });
};

const open = (id: string) => {
  state.visible = true;
  if (id) {
    state.id = id;
    getDetail(id);
  } else {
    const { level = 1, parent_id = 0 } = route.query;
    state.ruleForm = {
      name: '',
      rank: '',
    };
    state.parentId = parent_id as number;
    state.categoryLevel = level as number;
  }
};

const submitForm = () => {
  FormRef.value?.validate((valid) => {
    if (valid) {
      if (props.type == 'add') {
        // 添加方法
        axios
          .post('/categories', {
            categoryLevel: state.categoryLevel, // 分类等级
            parentId: state.parentId, // 当前分类的父分类 id
            categoryName: state.ruleForm.name, // 分类名称
            categoryRank: state.ruleForm.rank, // 分类权重
          })
          .then(() => {
            ElMessage.success('添加成功');
            state.visible = false;
            // 接口回调之后，运行重新获取列表方法 reload
            if (props.reload) props.reload();
          });
      } else {
        axios
          .put('/categories', {
            categoryId: state.id,
            categoryLevel: state.categoryLevel,
            parentId: state.categoryLevel,
            categoryName: state.ruleForm.name,
            categoryRank: state.ruleForm.rank,
          })
          .then(() => {
            ElMessage.success('修改成功');
            state.visible = false;
            // 接口回调之后，运行重新获取列表方法 reload
            if (props.reload) props.reload();
          });
      }
    } else {
      ElMessage.error('输入栏不可为空！！！');
      return;
    }
  });
};

defineExpose({
  open,
});
</script>

<template>
  <el-dialog
    :title="type == 'add' ? '添加分类' : '修改分类'"
    v-model="state.visible"
    width="400px"
  >
    <el-form
      :model="state.ruleForm"
      :rules="state.rules"
      ref="FormRef"
      label-width="100px"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="state.ruleForm.name"
          placeholder="请输入商品名称"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品序号" prop="rank">
        <el-input
          v-model="state.ruleForm.rank"
          placeholder="请输入商品序号"
          type="number"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="foot">
        <el-button @click="state.visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="less"></style>
