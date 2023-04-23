<template>
  <div>
    <el-dialog
      title="Pin By CID"
      :model-value="visible"
      class="pin-dialog"
      width="600px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <div class="pin_tips">
        Give a Content Identifier (CID), also known as a hash, and an optional
        name to pin. Foggie will then add the CID to the queue and start
        searching for your content. Once your content has been found, it will be
        pinned.
      </div>
      <div class="pin_tips">
        Please note: The IPFS network is big, and it might take quite some time
        to find / retrieve content. Please be patient as our nodes search for
        your content. It is also possible that the content is no longer
        available on the network. In that scenario, your pin by CID action will
        fail.
      </div>
      <el-form
        label-position="top"
        :model="syncForm"
        :rules="syncrules"
        ref="syncFormRef"
      >
        <el-form-item label="IPFS CID To Pin" prop="cid">
          <el-input v-model="syncForm.cid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Custom Name For Pin" prop="name">
          <el-input v-model="syncForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">Cancel</el-button>
        <div class="color-box">
          <el-button @click="handleSync">
            <RippleInk></RippleInk>
            Confirm</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  toRefs,
  ref,
  getCurrentInstance,
  reactive,
  watch,
} from "vue";
// import RippleInk from "../../rippleInk";
import { IPFSSync } from "@/utils/api";
const { proxy } = getCurrentInstance();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  currentOODItem: Object,
});
const { visible, currentOODItem } = toRefs(props);
const syncForm = reactive({
  cid: "",
  name: "",
});
const syncrules = {
  cid: [
    {
      required: true,
      message: "Please enter IPFS CID To Pin!",
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: "Please enter Custom Name For Pin!",
      trigger: "blur",
    },
  ],
};
const syncFormRef = ref(null);
const device_id = currentOODItem.value.device_id;

const handleSync = () => {
  syncFormRef.value.validate((valid) => {
    if (valid) {
      let data = {
        key: syncForm.cid,
        path: syncForm.name,
      };
      IPFSSync(device_id, data)
        .then((res) => {
          if (res) {
            proxy.$notify({
              type: "success",
              message: "Pin by CID In operation!",
              position: "bottom-left",
            });
            beforeClose();
          }
        })
        .catch(() => {
          proxy.$notify({
            type: "error",
            message: "error submit!!",
            position: "bottom-left",
          });
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
const emits = defineEmits(["update:visible"]);
const beforeClose = () => {
  emits("update:visible", false);
};
watch(visible, (val) => {
  if (!val) {
    syncForm.cid = "";
    syncForm.name = "";
  }
});
</script>
