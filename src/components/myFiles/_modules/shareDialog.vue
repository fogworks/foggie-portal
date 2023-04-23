<template>
  <div>
    <el-dialog
      :model-value="visible"
      title=" "
      width="600px"
      class="share-dialog"
      :before-close="beforeClose"
    >
      <div class="share-content">
        <div class="title">
          <!-- {{ shareRefContent.user || "" }} -->
          Go To Share
        </div>
        <!-- <div class="user-info">
          {{ shareRefContent.user || "" }}
        </div> -->
        <div class="user-info link-row" v-if="shareRefContent.ipfsStr">
          <span class="ip">
            {{ handleID(shareRefContent.ipfsStr) || "" }}
          </span>
          <svg-icon
            icon-class="copy"
            class="copy-icon"
            @click="copyLink(shareRefContent.ipfsStr)"
          ></svg-icon>
        </div>
        <div class="user-info link-row" v-if="shareRefContent.cyfsStr">
          <span class="ip">
            {{ handleID(shareRefContent.cyfsStr) || "" }}
          </span>
          <svg-icon
            icon-class="copy"
            class="copy-icon"
            @click="copyLink(shareRefContent.cyfsStr)"
          ></svg-icon>
        </div>
        <div class="user-info link-row" v-if="shareRefContent.httpStr">
          <a :href="shareRefContent.httpStr || ''" target="_blank">
            {{ handleID(shareRefContent.httpStr) || "" }}
          </a>
          <svg-icon
            icon-class="copy"
            class="copy-icon"
            @click="copyLink(shareRefContent.httpStr)"
          ></svg-icon>
        </div>
        <div class="share-str link-row">
          {{ shareRefContent.shareStr || "" }}
        </div>
        <div class="user-info">
          <div class="color-box">
            <el-button @click="copyLink(copyContent)">
              <RippleInk></RippleInk>
              Copied to clipboard</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, toRefs, getCurrentInstance } from "vue";
// import RippleInk from "../../rippleInk";

const { proxy } = getCurrentInstance();
const props = defineProps({
  shareRefContent: {
    type: Object,
    default: () => {},
  },
  visible: {
    type: Boolean,
    default: false,
  },
  copyContent: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["update:visible"]);
const { shareRefContent, visible, copyContent } = toRefs(props);
const beforeClose = () => {
  emits("update:visible", false);
};
const handleID = (str) => {
  return (
    str.substring(0, 25) + "..." + str.substring(str.length - 5, str.length)
  );
};
const copyLink = (text) => {
  var input = document.createElement("input"); // 创建input对象
  input.value = text; // 设置复制内容
  document.body.appendChild(input); // 添加临时实例
  input.select(); // 选择实例内容
  document.execCommand("Copy"); // 执行复制
  document.body.removeChild(input); // 删除临时实例
  // let str = `Copying  ${type} successful!`;
  // this.$message.success(str);
  proxy.$notify({
    message: "Copy succeeded",
    type: "success",
    position: "bottom-left",
  });
};
</script>

