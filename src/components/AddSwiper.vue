<script setup lang="ts">
import axios from "../utils/axios";
import { localGet, uploadImgServer } from "../utils/index";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { FormInstance } from "element-plus";

let refForm = ref<FormInstance>();

const props = defineProps({
  type: String, // add 为新增；edit 为编辑
  reload: Function, // table 刷新的方法
});

const state = reactive({
  uploadImgServer,
  visible: false,
  token: localGet("token") || "",
  id: "",
  ruleForm: {
    url: "",
    link: "",
    sort: "",
  },
  rules: {
    url: [
      {
        required: true,
        message: "图片不能为空",
        trigger: ["change"],
      },
    ],
    sort: [
      {
        required: true,
        message: "排序值不能为空",
        trigger: ["change"],
      },
    ],
  },
});

const getDetail = (id: string) => {
  axios.get(`/carousels/${id}`).then((res: any) => {
    state.ruleForm = {
      url: res.carouselUrl,
      link: res.redirectUrl,
      sort: res.carouselRank,
    };
  });
};

const handelBeforeUpload = (file: any) => {
  const sufix = file.name.split(".")[1] || "";
  if (!["jpg", "png", "jpeg"].includes(sufix)) {
    ElMessage.error("文件类型错误！！！,请上传png， jpg， jpeg文件");
    return false;
  }
};

// 上传图片
const handleUrlSuccess = (val: any) => {
  state.ruleForm.url = val.data || "";
};

const open = (id: any) => {
  state.visible = true;

  if (id) {
    state.id = id;
    getDetail(id);
  } else {
    state.ruleForm = {
      url: "",
      link: "",
      sort: "",
    };
  }
  console.log(state.visible);
};

const submitForm = () => {
  console.log(refForm.value?.validate);
  refForm.value?.validate((valid) => {
    if (valid) {
      if (props.type == "add") {
        axios
          .post("/carousels", {
            carouselUrl: state.ruleForm.url,
            redirectUrl: state.ruleForm.link,
            carouselRank: state.ruleForm.sort,
          })
          .then(() => {
            ElMessage.success("文件上传成功");
            state.visible = false;
            if (props.reload) props.reload();
          });
      } else {
        axios
          .put("/carousels", {
            carouselId: state.id,
            carouselUrl: state.ruleForm.url,
            redirectUrl: state.ruleForm.link,
            carouselRank: state.ruleForm.sort,
          })
          .then(() => {
            ElMessage.success("文件编辑成功");
            state.visible = false;
            if (props.reload) props.reload();
          });
      }
    }
  });
};

defineExpose({ open });
</script>

<template>
  <el-dialog
    :title="type == 'add' ? '添加图片' : '编辑图片'"
    v-model="state.visible"
    width="400px"
  >
    <el-form
      ref="refForm"
      :model="state.ruleForm"
      :rules="state.rules"
      style="width: 88%; margin: 0px 20px"
      label-width="90px"
    >
      <el-form-item label="图片" prop="url">
        <el-upload
          :action="state.uploadImgServer"
          accept="jpg,png,jpeg"
          :headers="{
            token: state.token,
          }"
          :show-file-list="false"
          :before-upload="handelBeforeUpload"
          :on-success="handleUrlSuccess"
          class="avatar-uploader"
        >
          <img
            style="width: 200px; height: 100px; border: 1px solid #e9e9e9"
            v-if="state.ruleForm.url"
            :src="state.ruleForm.url"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input
          placeholder="请输入链接"
          type="text"
          v-model="state.ruleForm.link"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input
          placeholder="请输入排序值"
          type="number"
          v-model="state.ruleForm.sort"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="foot">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}
.avatar-uploader >>> .el-upload {
  width: 100%;
  text-align: center;
}
.avatar-uploader-icon {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
}
</style>
