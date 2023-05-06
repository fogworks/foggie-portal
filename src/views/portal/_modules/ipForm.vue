<template>
  <div>
    <el-dialog
      width="500px"
      :before-close="cancel"
      :model-value="visible"
      title="Add device"
      class="ip-dialog"
    >
      <el-form
        class="ip-form"
        ref="ipFormRef"
        :model="form"
        :rules="rules"
        label-width="60px"
      >
        <!-- <el-form-item label="name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item> -->
        <el-form-item label="ip" prop="ip">
          <el-input v-model="form.ip"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">cancel</el-button>
        <el-button type="primary" @click="confirm">Next</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  reactive,
  toRefs,
  getCurrentInstance,
} from "vue";
import { getNetStatus, pingUrl } from "@/utils/api";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const { proxy } = getCurrentInstance();
const emit = defineEmits(["update:visible"]);
const { visible } = toRefs(props);
const form = reactive({
  name: "",
  ip: "",
});
const ipFormRef = ref(null);
const rules = {
  name: { required: true, message: "Please fill in the name", trigger: "blur" },
  ip: {
    required: true,
    message: "Please fill in the IP address",
    trigger: "blur",
  },
};
function ping(ip, timeout, success, callback) {
  var img = new Image();
  var start = new Date().getTime();
  img.src = /^(http|https)/.test(ip)
    ? ip + "?t=" + start
    : "http://" + ip + "?t=" + start;
  var flag = false; //无法访问
  img.onload = function () {
    flag = true;
    success();
  };
  img.onerror = function () {
    flag = true;
    callback();
  };
  var timer = setTimeout(function () {
    if (!flag) {
      //如果真的无法访问
      flag = false;
      callback();
    }
  }, timeout);
}
const confirm = () => {
  ipFormRef.value.validate((valid) => {
    if (valid) {
      let data = {
        url: `http://${form.ip}:9094/`,
      };
      pingUrl(data).then((r) => {
        emit("getMax", r.result);
        cancel();
      });
    }

    // if (valid) {
    //   ping(
    //     form.ip,
    //     1000,
    //     () => {
    //       // 成功
    //       proxy.$notify({
    //         type: "success",
    //         message: "Successfully added",
    //       });
    //       emit("update:visible", false);
    //     },
    //     () => {
    //       proxy.$notify({
    //         type: "error",
    //         message: "This network is inaccessible",
    //       });
    //     }
    //   );
    // }
  });
};
const cancel = () => {
  emit("update:visible", false);
};
</script>

<style lang="scss" scoped>
.ip-form {
  margin-top: 30px;
  :deep {
    .el-form-item__label {
      color: #000;
    }
  }
}
</style>
<style lang="scss">
.ip-dialog {
  .el-button {
    min-width: 80px;
    width: unset;
    height: 40px;
    font-size: 16px;
    border-radius: 50px;
  }
}
</style>
