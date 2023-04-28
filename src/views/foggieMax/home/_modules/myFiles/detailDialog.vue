<template>
  <el-dialog
    top="10px"
    width="1025px"
    :model-value="visible"
    :before-close="beforeClose"
  >
    <div class="detail-container">
      <div class="title">
        {{ documentInfo.title }}
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
        <div class="logo-box" v-if="!detailData.data.isSystemImg">
          <svg-icon
            v-if="theme === 'dark'"
            icon-class="logo-dog"
            v-for="i in 20"
          ></svg-icon>
          <svg-icon
            v-else
            icon-class="logo-dog-black"
            v-for="i in 20"
          ></svg-icon>
        </div>
        <div v-if="!documentInfo.url" class="no-previewed-tip">
          The current file type cannot be previewed
        </div>
        <img v-if="documentInfo.url" :src="documentInfo.url" />
      </div>
      <div class="action-btn">
        <div>
          <el-icon @click="doShare()" size="32" class="action-icon"
            ><Share
          /></el-icon>
        </div>
        <div class="line"></div>
        <div>
          <el-icon @click="downloadItem()" size="32" class="action-icon"
            ><Download
          /></el-icon>
        </div>
      </div>
    </div>
  </el-dialog>
  <ShareDialog
    :shareRefContent="shareRefContent"
    :copyContent="copyContent"
    v-model:visible="showShareDialog"
  ></ShareDialog>
</template>

<script>
import { reactive, onMounted, ref, computed, inject, toRefs } from "vue";
import ShareDialog from "./shareDialog";
import { pIN, shareLink } from "@/utils/api.js";
import { ElNotification } from "element-plus";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  components: { ShareDialog },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object,
      default: { data: {} },
    },
  },
  setup(props, { emit }) {
    const { visible } = toRefs(props);
    const detailData = reactive(props.detailData);
    const deviceData = inject("deviceData");
    const store = useStore();
    const router = useRouter();
    const theme = computed(() => store.getters.theme);
    // const currentOODItem = JSON.parse(localStorage.getItem("currentOODItem"));
    const currentOODItem = inject("currentOODItem");
    // const currentOODItem = computed(() => store.getters.currentOODItem);
    const documentInfo = reactive({
      title: detailData.data.name,
      idList: detailData.data.idList,
      url: detailData.data.imgUrlLarge,
    });
    const shareRefContent = reactive({});
    const showShareDialog = ref(false);
    const device_id = currentOODItem.value.data.device_id;
    const device_id_real = currentOODItem.value.data.device_id_real;
    const initDetail = () => {};
    onMounted(initDetail);
    const beforeClose = () => {
      emit("update:visible", false);
    };
    const copyContent = ref("");

    const doShare = async () => {
      if (!detailData.data.canShare) {
        ElNotification({
          type: "info",
          message: "This file cannot be shared",
          position: "bottom-left",
        });
        return false;
      }
      let item = detailData.data;
      let key = "";
      if (item) {
        key = item.name;
        let data = {
          key: item.pubkey,
          is_pin: false,
          new_path: item.key,
        };
        await pIN(data);
      }
      const isFolder = item.type === "application/x-directory";
      if (key) {
        let user = window.sessionStorage.getItem("walletUser");
        let ood_id_cyfs = device_id_real ? device_id_real : device_id;
        let _key = encodeURIComponent(key);
        let data = await shareLink(device_id, _key);
        let meta = data.meta;
        let httpStr = `http://${deviceData.dedicatedip}/#/detailFog?pubkey=${meta.pubkey}&name=${item.key}&isFolder=${isFolder}`;

        let cyfsStr = `cyfs://o/${ood_id_cyfs}/${meta.file_id}`;
        let ipfsStr = `ipfs://${meta.cid}`;

        // this.shareTitle = this.$t("vood.uploadShareTitle");
        // this.shareContent = this.$t("vood.uploadShareContent");
        let shareCopyContent = `${user} publish ${key} to Web3` + "\n";
        shareRefContent.user = `${user} publish ${key} to Web3`;

        let myQrcode = window.sessionStorage.getItem("myQrcode");
        let code = `http://foggie.fogworks.io/?pcode=${myQrcode}`;
        let shareStr = `The Web3 content I publish with Foggie is my digital asset and cannot be tampered with or deleted without my permission. It can also help us earn $DMC crypto rewards. Let's Web3-to-Earn together! Use my invite link ${code} to adopt a Foggie so we can all earn $DMC and grow Web3 together.Thanks!`;
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareCopyContent = shareCopyContent + httpStr + " \n";
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareRefContent.httpStr = httpStr;

        if (
          (currentOODItem.value.data.cbs_state === "finish" ||
            currentOODItem.value.data.cbs_state === "upgrade_finish" ||
            currentOODItem.value.data.ipfs_state === "finish") &&
          currentOODItem.value.data.ipfs_service_state === "start" &&
          meta.cid
        ) {
          shareCopyContent = shareCopyContent + ipfsStr + " \n";
          shareCopyContent = shareCopyContent + " " + " \n ";
          shareRefContent.ipfsStr = ipfsStr;
          shareRefContent.httpStr =
            shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;
        }

        if (
          (currentOODItem.value.data.cbs_state === "finish" ||
            currentOODItem.value.data.cbs_state === "upgrade_finish" ||
            currentOODItem.value.data.cyfs_state === "finish") &&
          currentOODItem.value.data.cyfs_service_state === "start" &&
          meta.file_id
        ) {
          shareCopyContent = shareCopyContent + cyfsStr + " \n";
          shareCopyContent = shareCopyContent + " " + " \n ";
          shareRefContent.cyfsStr = cyfsStr;
          shareRefContent.httpStr =
            shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;
        }

        shareCopyContent = shareCopyContent + shareStr + " \n";
        shareRefContent.shareStr = shareStr;
        showShareDialog.value = true;
        copyContent.value = shareCopyContent;

        // this.shareBoxShow = true;
        console.log(
          "shareCopyContentshareCopyContentshareCopyContent",
          shareCopyContent
        );
      } else {
        // this.closeRewardBox();
      }
    };
    const downloadItem = () => {
      let item = detailData.data;
      let ID = device_id;
      let pubkey = item.pubkey;
      let downloadUrl = `/fog/${pubkey}?dl=true`;

      var oA = document.createElement("a");
      oA.download = item.name; // 设置下载的文件名，默认是'下载'
      oA.href = downloadUrl;
      document.body.appendChild(oA);
      oA.click();
      oA.remove(); // 下载之后把创建的元素删除
    };
    function copySecret(key) {
      var input = document.createElement("textarea"); // 创建input对象
      input.value = key; // 设置复制内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      ElNotification({
        type: "success",
        message: "Copy succeeded",
        position: "bottom-left",
      });
    }

    return {
      theme,
      documentInfo,
      detailData,
      device_id,
      currentOODItem,
      initDetail,
      doShare,
      downloadItem,
      copySecret,
      router,
      shareRefContent,
      showShareDialog,
      shareRefContent,
      visible,
      copyContent,
      beforeClose,
    };
  },
};
</script>

<style lang="scss" scoped>
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
      color: #000;
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
    width: 220px;
    height: 80px;
    margin: 40px auto 20px;
    background-color: var(--card-bg);
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    border: var(--theme-border);

    div {
      flex: 1;
      text-align: center;
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
