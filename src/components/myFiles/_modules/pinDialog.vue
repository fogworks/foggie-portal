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
            (currentOODItems.deploy_vood_gateway_state === 'finish' ||
              currentOODItems.deploy_vood_gateway_state === 'upgrade_finish' ||
              currentOODItems.deploy_ipfs_gateway_state === 'finish') &&
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
// import RippleInk from "../../rippleInk";

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
