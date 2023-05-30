<template>
  <div>
    <el-dialog
      append-to-body
      title="Join the central mining pool"
      :model-value="visible"
      class="pool-dialog"
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
      <!-- <div class="pin_tips">
        Please note: The IPFS network is big, and it might take quite some time
        to find / retrieve content. Please be patient as our nodes search for
        your content. It is also possible that the content is no longer
        available on the network. In that scenario, your pin by CID action will
        fail.
      </div> -->
      <el-form
        @submit.native.prevent
        label-position="right"
        label-width="150px"
        :model="poolForm"
        :rules="poolrules"
        ref="poolFormRef"
      >
        <el-form-item label="Space Size" prop="spaceSize">
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="0"
            :min="1"
            v-model="poolForm.spaceSize"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Pin" prop="isPin">
          <el-checkbox v-model="poolForm.isPin" size="large" />
        </el-form-item>
        <el-form-item
          v-if="poolForm.isPin"
          label="Pin cache size (G)"
          prop="pinCacheSize"
        >
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="0"
            :min="1"
            v-model="poolForm.pinCacheSize"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Service period" prop="weeks">
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="0"
            :min="1"
            v-model="poolForm.weeks"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Pledged currency" prop="pledged">
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="4"
            :min="0"
            v-model="poolForm.pledged"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="DMC Account" prop="receiver">
          <el-input
            v-model.trim="poolForm.receiver"
            placeholder="Please enter your username in the DMC wallet"
          ></el-input>
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
  inject,
} from "vue";
import RippleInk from "@/components/rippleInk";
import { IPFSSync } from "@/utils/api";
import { check_account } from "@/api/common.js";

const { proxy } = getCurrentInstance();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const { visible } = toRefs(props);
const poolForm = reactive({
  spaceSize: 1,
  isPin: false,
  pinCacheSize: 1,
  weeks: 24,
  pledged: 0,
  receiver: "",
});

const validateReceiver = (rule, value, cb) => {
  if (!value) {
    cb(new Error("Please enter the account address to withdraw"));
  } else {
    let postdata = {
      username: poolForm.receiver,
    };
    check_account(postdata).then(
      (res) => {
        if (res.code == 200) {
          cb();
        } else {
          cb(
            new Error(
              "The account does not exist. Please enter the correct account address"
            )
          );
        }
      },
      (err) => {
        cb(
          new Error(
            "The account does not exist. Please enter the correct account address"
          )
        );
      }
    );
  }
};
const poolrules = {
  spaceSize: [
    {
      required: true,
      message: "Please enter IPFS CID To Pin!",
      trigger: "blur",
    },
  ],
  pinCacheSize: [
    {
      required: true,
      message: "Please enter Custom Name For Pin!",
      trigger: "blur",
    },
  ],
  receiver: [{ validator: validateReceiver, trigger: "blur" }],
};
const deviceData = inject("deviceData");
const poolFormRef = ref(null);
const device_id = deviceData.device_id;

const handleSync = () => {
  poolFormRef.value.validate((valid) => {
    if (valid) {
      let data = {
        key: poolForm.cid,
        path: poolForm.name,
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
      return false;
    }
  });
};
const emits = defineEmits(["update:visible"]);
const beforeClose = () => {
  emits("update:visible", false);
};
</script>

<style lang="scss" scoped>
.share-content {
  margin-top: 20px;
  color: #000;
  font-size: 20px;
  .title {
    margin-bottom: 30px;
    text-align: center;
    font-weight: 700;
    font-size: 26px;
  }
  .user-info {
    text-align: center;
    // height: 50px;
    line-height: 16px;

    .color-box {
      width: 165px;
      // .color-box();
      @include color-box;

      margin: 0 auto;
      .ripple-ink {
        border-radius: 45px;
      }
      .el-button {
        position: relative;
        font-size: 16px;
        color: var(--text-color);
        border: none;
        border-radius: 45px;
        box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
        background: var(--btn-gradient);
      }
    }
  }
}
</style>
<style lang="scss">
.pool-dialog {
  // background-image: var(--dialog-gradient-bg) !important;
  color: #000;
  .pin_tips {
    margin-top: 10px;
    color: #000;
  }
  .el-form {
    margin-top: 10px;
    .el-form-item {
      align-items: center;
    }
    .el-form-item__label {
      color: #000;
    }
    .number-input {
      .el-input__inner {
        text-align: left;
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      width: 100px;
      font-size: 18px;
      color: #000;
      border: none;
      border-radius: 45px;
      box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
      background: #f2f6ff;
    }
    .color-box {
      width: 100px;
      margin-left: 15px;
      // .color-box();
      @include color-box;

      .ripple-ink {
        border-radius: 45px;
      }
      .el-button {
        position: relative;
        color: var(--text-color);
        background: var(--btn-gradient);
      }
    }
  }
}
</style>
