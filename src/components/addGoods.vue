<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "@/utils/axios";
import { ElMessage, FormInstance } from "element-plus";

const FormRef = ref<FormInstance>();

const props = defineProps({
  type: String,
  configType: Number,
  reload: Function,
});

const state = reactive({
  visible: false,
  ruleForm: {
    name: "",
    link: "",
    id: "",
    sort: "",
  },
  rules: {
    name: [
      {
        required: true,
        message: "名称不能为空",
        trigger: ["change"],
      },
    ],
    id: [
      {
        required: true,
        message: "id不能为空",
        trigger: ["change"],
      },
    ],
    sort: [
      {
        required: true,
        message: "索引值不能为空",
        trigger: ["change"],
      },
    ],
  },
  id: "",
});

const getDetail = (id: string) => {
  axios.get(`/indexConfigs/${id}`).then((res: any) => {
    state.ruleForm = {
      name: res.configName,
      id: res.goodsId,
      link: res.redirectUrl,
      sort: res.configRank,
    };
  });
};

const open = (id: string) => {
  state.visible = true;
  if (id) {
    state.id = id;
    getDetail(id);
  } else {
    state.ruleForm = {
      name: "",
      id: "",
      link: "",
      sort: "",
    };
  }
};

const submitForm = () => {
  FormRef.value?.validate((valid) => {
    if (valid) {
      if (Number(state.ruleForm.id) < 0 || Number(state.ruleForm.id) > 200) {
        ElMessage.error("商品编号不能小于 0 或大于 200");
        return;
      }
      if (props.type == "add") {
        axios
          .post("/indexConfigs", {
            configType: props.configType || 3,
            configName: state.ruleForm.name,
            redirectUrl: state.ruleForm.link,
            goodsId: state.ruleForm.id,
            configRank: state.ruleForm.sort,
          })
          .then(() => {
            ElMessage.success("添加成功");
            state.visible = false;
            if (props.reload) props.reload();
          });
      } else {
        axios
          .put("/indexConfigs", {
            configId: state.id,
            configType: props.configType || 3,
            configName: state.ruleForm.name,
            redirectUrl: state.ruleForm.link,
            goodsId: state.ruleForm.id,
            configRank: state.ruleForm.sort,
          })
          .then(() => {
            ElMessage.success("修改成功");
            state.visible = false;
            if (props.reload) props.reload();
          });
      }
    }
  });
};

defineExpose({
  open,
});
</script>

<template>
  <el-dialog
    :title="type == 'add' ? '添加商品' : '修改商品'"
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
      <el-form-item label="跳转链接">
        <el-input
          v-model="state.ruleForm.link"
          placeholder=""
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="id">
        <el-input
          v-model="state.ruleForm.id"
          placeholder="请输入商品编号"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input
          type="number"
          v-model="state.ruleForm.sort"
          placeholder="请输入商品序号"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="foot">
        <el-button @click="state.visible = false"> 取消 </el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less"></style>
