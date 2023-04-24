<template>
  <div>
    <el-dialog
      :model-value="visible"
      :title="title[type]"
      width="600px"
      class="share-dialog"
      :before-close="beforeClose"
    >
      <div class="pin-content">
        {{ content[type] }}
        <div
          v-if="
            type === 'ipfs' &&
            currentFileItem.pubkey &&
            (currentOODItems.cbs_state === 'finish' ||
              currentOODItems.cbs_state === 'upgrade_finish' ||
              currentOODItems.ipfs_state === 'finish') &&
            currentOODItem.ipfs_service_state === 'start'
          "
        >
          <el-checkbox v-model="checked" label="IPFS PIN" size="large" />
        </div>
      </div>
      <template #footer>
        <div class="share-content">
          <div class="user-info">
            <div class="color-box">
              <el-button @click="emits('confirm', checked)">
                <RippleInk></RippleInk>
                Confirm</el-button
              >
            </div>
          </div>
        </div>
      </template>
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
} from "vue";
import RippleInk from "@/components/rippleInk";

const { proxy } = getCurrentInstance();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  type: String,
  currentFileItem: Object,
  currentOODItems: Object,
});
const { visible, type, currentFileItem, currentOODItems } = toRefs(props);
const emits = defineEmits(["update:visible", "confirm"]);
const title = reactive({
  cyfs: "Make File ID",
  ipfs: "Upload to IPFS",
});
const content = reactive({
  cyfs: "Are you sure you want to create a FileID?",
  ipfs: "Do you want to upload your files to IPFS?",
});
const checked = ref(false);
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
.share-dialog {
  // background-image: var(--dialog-gradient-bg) !important;
  .pin-content {
    margin-top: 20px;
    color: #000;
  }
}
</style>
