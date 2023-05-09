<template>
  <div class="detail-container">
    <div class="title">
      {{ documentInfo.title }}
      <svg-icon icon-class="back" @click="router.push('/home')"></svg-icon>
    </div>
    <div v-for="item in documentInfo.idList" class="id-row">
      <template v-if="item.code">
        <div class="name">
          {{ item.name }}
        </div>
        <div class="code">
          {{ item.code }}
        </div>
        <svg-icon
          icon-class="copy"
          class="copy-icon"
          @click="copySecret(item.code)"
        ></svg-icon>
        <!-- <img src="@/assets/copy.png" alt="" /> -->
      </template>
    </div>
    <div class="preview-box">
      <div class="logo-box">
        <svg-icon
          v-if="theme === 'dark'"
          icon-class="logo-dog"
          v-for="i in 20"
        ></svg-icon>
        <svg-icon v-else icon-class="logo-dog-black" v-for="i in 20"></svg-icon>
      </div>
      <div v-if="!documentInfo.url" class="no-previewed-tip">
        The current file type cannot be previewed
      </div>
      <img v-if="documentInfo.url" :src="documentInfo.url" />
    </div>
    <div class="action-btn">
      <div>
        <el-icon @click="downloadItem()" size="32" class="action-icon"
          ><Download
        /></el-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const theme = computed(() => store.getters.theme);
    const pubkey = route.query.pubkey || "";
    const name = route.query.name;
    const isFolder = route.query.isFolder;
    const ipfsStr = route.query.ipfsStr || "";
    const cyfsStr = route.query.cyfsStr || "";
    const documentInfo = reactive({
      title: name,
      idList: [],
      url: `/object?pubkey=${pubkey}`,
    });
    if (ipfsStr)
      documentInfo.idList.push({ name: "IPFS", code: ipfsStr.substr(7) });
    if (cyfsStr)
      documentInfo.idList.push({ name: "CYFS", code: cyfsStr.substr(7) });
    const downloadItem = () => {
      let downloadUrl = `/fog/${pubkey}?dl=true`;

      var oA = document.createElement("a");
      oA.download = name;
      oA.href = downloadUrl;
      document.body.appendChild(oA);
      oA.click();
      oA.remove();
    };
    function copySecret(key) {
      var input = document.createElement("textarea");
      input.value = key;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      ElNotification({
        type: "success",
        message: "Copy succeeded",
        position: "bottom-left",
      });
    }
    return {
      theme,
      documentInfo,
      downloadItem,
      copySecret,
      router,
    };
  },
};
</script>

<style lang="scss" scoped>
$light_blue: #29abff;
.detail-container {
  width: 960px;
  margin: 8px auto;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    font-weight: 700;
    color: $light_blue;
    text-align: left;
    svg {
      font-size: 35px;
      cursor: pointer;
      transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
  .id-row {
    display: flex;
    align-items: center;
    .name {
      margin-top: 8px;
      margin-right: 8px;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-color);
    }
    .code {
      margin-top: 8px;
      max-width: 700px;
      margin-right: 8px;
      font-size: 18px;
      color: #999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .copy-icon {
      margin-top: 8px;
      font-size: 20px;
      color: var(--text-color);
      cursor: pointer;
    }
    img {
      margin-top: 8px;
      width: 24px;
      cursor: pointer;
    }
  }
  .preview-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 640px;
    padding: 5px;
    margin-top: 12px;
    // background-color: var(--card-bg);
    box-shadow: var(--box-shadow);
    border: solid 1px transparent;
    border-radius: 16px;
    background-color: #ffffff99;
    // background-color: #ebeef569;
    text-align: center;
    overflow: hidden;
    // &::before {
    //   content: "";
    //   position: absolute;
    //   z-index: 0;
    //   width: 120%;
    //   height: 200%;
    //   opacity: 0.6;
    //   background-image: url("~@/assets/logo-dog.svg");
    //   background-size: 130px;
    //   background-repeat: space space;
    //   transform: rotate(-37deg);
    // }
    .logo-box {
      position: absolute;
      width: 120%;
      height: 200%;
      opacity: 0.6;
      transform: rotate(-37deg);
      svg {
        color: var(--text-color);
        font-size: 200px;
        margin: 50px;
      }
    }

    .no-previewed-tip {
      font-size: 30px;
      font-weight: 700;
      color: var(--text-color);
      z-index: 1;
    }
    img {
      max-width: 80%;
      min-width: 50%;
      max-height: 80%;
      z-index: 1;
      box-shadow: none;
      cursor: pointer;
      object-fit: contain;
      transition: all 3s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
      &:hover {
        transform: scale(1.1);
        box-shadow: rgba(28, 28, 86, 0.3) 0px 20px 40px,
          rgba(0, 0, 0, 0.05) 0px 1px 3px;
      }
    }
  }
  .action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 110px;
    height: 80px;
    margin: 40px auto 128px;
    background-color: var(--card-bg);
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    border: var(--theme-border);

    div {
      flex: 1;
      .action-icon {
        color: var(--text-color);
        cursor: pointer;
        transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
        &:hover {
          & {
            color: $light_blue;
            transform: scale(1.2);
          }
        }
      }
    }
    .line {
      width: 1px;
      max-width: 1px;
      height: 40px;
      background-color: #ccc;
    }
  }
}
</style>
