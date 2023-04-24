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
import RippleInk from "@/components/rippleInk";

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
    display: flex;
    justify-content: center;
    align-items: center;
    // height: 50px;
    // line-height: 16px;
    margin-bottom: 30px;
    word-break: break-all;
    // text-indent: 30px;
    .ip {
      display: inline-block;
      max-width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 700;
      color: #134975;
    }
    a {
      color: $light_blue;
      word-break: break-all;
      font-weight: 700;
    }
    .copy-icon {
      margin-left: 10px;
      vertical-align: middle;
      color: $light_blue;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.2);
      }
    }
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
  .share-str {
    margin-bottom: 20px;
    word-break: break-all;
    text-indent: 30px;
    color: #134975;
  }
}
</style>
<style lang="scss">
.share-dialog {
  // background-image: var(--dialog-gradient-bg) !important;
}
</style>
