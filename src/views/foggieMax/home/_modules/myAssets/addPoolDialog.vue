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
        label-position="top"
        label-width="200px"
        :model="poolForm"
        :rules="poolrules"
        ref="poolFormRef"
      >
        <el-form-item label="Space Size (G)" prop="space">
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="0"
            :min="1"
            v-model="poolForm.space"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
        <el-form-item class="isPin" label="Pin" prop="is_pin">
          <el-checkbox v-model="poolForm.is_pin" size="large" />
        </el-form-item>
        <el-form-item
          v-if="poolForm.is_pin"
          label="Pin cache size (G)"
          prop="pin_size"
        >
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="0"
            :min="1"
            v-model="poolForm.pin_size"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Service period (weeks)" prop="expire_on_week">
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="0"
            :min="1"
            v-model="poolForm.expire_on_week"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="stake_asset currency" prop="stake_asset">
          <el-input-number
            class="number-input"
            style="width: 100%"
            :controls="false"
            :precision="4"
            :min="0"
            v-model="poolForm.stake_asset"
            autocomplete="off"
          ></el-input-number>
        </el-form-item> -->
        <el-form-item label="DMC Account" prop="dmc_account">
          <el-input
            v-model.trim="poolForm.dmc_account"
            placeholder="Please enter your username in the DMC wallet"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">Cancel</el-button>
        <div class="color-box">
          <el-button @click="handleRegister" :loading="btnLoading">
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
import { minerRegister } from "@/utils/api";
import { check_account } from "@/api/common.js";

const { proxy } = getCurrentInstance();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:visible"]);
const { visible } = toRefs(props);
const btnLoading = ref(false);
const poolForm = reactive({
  space: 1,
  is_pin: false,
  pin_size: 1,
  expire_on_week: 24,
  stake_asset: "",
  dmc_account: "",
});

const validateDmcAccount = (rule, value, cb) => {
  if (!value) {
    cb(new Error("Please enter the account address to withdraw"));
  } else {
    let postdata = {
      username: poolForm.dmc_account,
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
  space: [
    {
      required: true,
      message: "Please enter the space to add to the mining pool!",
      trigger: "blur",
    },
  ],
  pin_size: [
    {
      required: true,
      message: "Please enter the pin cache size!",
      trigger: "blur",
    },
  ],
  expire_on_week: [
    {
      required: true,
      message: "Please enter the Service period!",
      trigger: "blur",
    },
  ],
  dmc_account: [
    { required: true, validator: validateDmcAccount, trigger: "blur" },
  ],
};
const deviceData = inject("deviceData");
const poolFormRef = ref(null);

const handleRegister = () => {
  poolFormRef.value.validate((valid) => {
    if (valid) {
      let data = {
        ...poolForm,
        space: String(poolForm.space),
        pin_size: String(poolForm.pin_size),
      };
      btnLoading.value = true;
      minerRegister(data, deviceData)
        .then((res) => {
          if (res) {
            proxy.$notify({
              type: "success",
              message: "Successfully joined the central mining pool!",
              position: "bottom-left",
            });
            beforeClose();
          }
        })
        .catch(() => {
          // proxy.$notify({
          //   type: "error",
          //   message: "error submit!!",
          //   position: "bottom-left",
          // });
        })
        .finally(() => {
          btnLoading.value = false;
        });
    } else {
      return false;
    }
  });
};
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
    .isPin {
      display: flex;
      .el-form-item__label {
        margin: 0;
      }
    }
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
