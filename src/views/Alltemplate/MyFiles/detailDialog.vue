<template>
  <el-dialog
    append-to-body
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
import {
  reactive,
  onMounted,
  ref,
  computed,
  inject,
  toRefs,
  getCurrentInstance,
} from "vue";
import ShareDialog from "@/views/foggieMax/home/_modules/myFiles/shareDialog";
import { publishPin } from "@/utils/api.js";
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
    deviceData: {
      type: Object,
      default: { data: {} },
    },
    orderId: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const device_id = "";
    const device_id_real = "";
    let shareCopyContent = "";
    const { proxy } = getCurrentInstance();
    const { visible } = toRefs(props);
    const detailData = reactive(props.detailData);
    const orderId = reactive(props.orderId);
    const deviceData = reactive(props.deviceData);
    const email = reactive(props.email);
    const store = useStore();
    const router = useRouter();
    const theme = computed(() => store.getters.theme);
    // const currentOODItem = JSON.parse(localStorage.getItem("currentOODItem"));
    // const currentOODItem = inject("currentOODItem");
    // const currentOODItem = computed(() => store.getters.currentOODItem);
    const documentInfo = reactive({
      title: detailData.data.name,
      idList: detailData.data.idList,
      url: detailData.data.imgUrlLarge,
    });
    const shareRefContent = reactive({});
    const showShareDialog = ref(false);
    // const device_id = currentOODItem.value.data.device_id;
    // const device_id_real = currentOODItem.value.data.device_id_real;
    const initDetail = () => {};
    onMounted(initDetail);
    const beforeClose = () => {
      emit("update:visible", false);
    };
    const copyContent = ref("");
    const tokenMap = computed(() => store.getters.tokenMap);

    let token = tokenMap.value[deviceData.device_id];

    const ipfsPin = (item) => {
      let ip_address = deviceData.rpc.split(":")[0];
      let port = deviceData.rpc.split(":")[1];
      let data = {
        ip_address,
        port,
        token,
        peerId: deviceData.peer_id,
        // peerId: "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA",
        Id: deviceData.foggie_id,
        exp: 3 * 24 * 3600,
        stype: "ipfs",
        pin: true,
        key: item.pubkey,
        isDir: item.isDir,
      };
      publishPin(data).then((res) => {
        if (res) {
          // ipfsDialogShow.value = false;
        }
      });
    };

    const doShare = async () => {
      let item = detailData.data;
      let key = item.key;
      if (item) {
        ipfsPin(item);
        // await pIN(data);
      }

      const isFolder = item.type === "application/x-directory";
      if (key) {
        // let user = window.sessionStorage.getItem("walletUser");
        let user = store.getters["global/userInfo"].dmc;
        let ood_id_cyfs = device_id_real ? device_id_real : device_id;
        let _key = encodeURIComponent(key);
        // let data = await shareLink(device_id.value, _key);
        // let meta = data.meta;
        let peer_id = deviceData.peer_id;
        // let httpStr = `${location.origin}/#/detailFog?pubkey=${meta.pubkey}&name=${item.key}&isFolder=${isFolder}`;
        let foggieStr = `foggie://${peer_id}/${orderId}/${item.cid}`;
        let httpStr = `http://${deviceData.rpc.split(":")[0]}/fog/${
          deviceData.foggie_id
        }/${item.cid}`;
        let cyfsStr = item.file_id
          ? `cyfs://o/${ood_id_cyfs}/${item.file_id}`
          : "";
        let ipfsStr = item.cid ? `ipfs://${item.cid}` : "";

        shareCopyContent = `${user} publish ${key} to Web3` + "\n";
        shareRefContent.user = `${user} publish ${key} to Web3`;
        let myQrcode = window.sessionStorage.getItem("myQrcode");
        let code = `http://foggie.fogworks.io/?pcode=${myQrcode}`;
        let shareStr = `The Web3 content I publish with Foggie is my digital asset and cannot be tampered with or deleted without my permission. It can also help us earn $DMC crypto rewards. Let's Web3-to-Earn together! Use my invite link ${code} to adopt a Foggie so we can all earn $DMC and grow Web3 together.Thanks!`;
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareCopyContent = shareCopyContent + httpStr + " \n";
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareRefContent.foggieStr = foggieStr;
        shareRefContent.httpStr = httpStr;

        // shareCopyContent = shareCopyContent + ipfsStr + " \n";
        // shareCopyContent = shareCopyContent + " " + " \n ";
        // shareRefContent.ipfsStr = ipfsStr;
        // shareRefContent.httpStr =
        //   shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;

        // shareCopyContent = shareCopyContent + cyfsStr + " \n";
        // shareCopyContent = shareCopyContent + " " + " \n ";
        // shareRefContent.cyfsStr = cyfsStr;
        // shareRefContent.httpStr =
        //   shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;

        shareCopyContent = shareCopyContent + shareStr + " \n";
        shareRefContent.shareStr = shareStr;
        copyContent.value = shareCopyContent;
        // shareRefContent.value=shareCopyContent
        showShareDialog.value = true;
        // this.shareBoxShow = true;
      } else {
        // this.closeRewardBox();
      }
    };

    const downloadItem = () => {
      // let ID = device_id.value;
      // let pubkey = item.pubkey;
      // let downloadUrl = `/fog/${pubkey}?dl=true`;
      // let cid = "QmNf82AtemgaHu2Sg3wpiaEFmoy6ym6Sv1Ma9eLJg6dHm3";
      let item = detailData.data;
      let cid = item.cid;
      let key = item.key;

      // let ip = "218.2.96.99";
      // // let ip = "154.31.34.194";
      // let port = 8007;

      // let Id = orderId;
      // let peerId = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";

      let ip = deviceData.rpc.split(":")[0];
      let port = deviceData.rpc.split(":")[1];
      let Id = deviceData.foggie_id;
      let peerId = deviceData.peer_id;
      let downloadUrl = `/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=space&token=${deviceData.value.upload_file_token}`;

      var oA = document.createElement("a");
      oA.download = item.name;
      oA.href = downloadUrl;
      document.body.appendChild(oA);
      oA.click();
      oA.remove();
      proxy.$notify({
        customClass: "notify-success",
        message: "Downloading",
        position: "bottom-left",
      });
    };
    function copySecret(key) {
      var input = document.createElement("textarea");
      input.value = key;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      ElNotification({
        customClass: "notify-success",
        message: "Copy succeeded",
        position: "bottom-left",
      });
    }

    return {
      theme,
      documentInfo,
      detailData,
      orderId,
      // device_id,
      // currentOODItem,
      initDetail,
      doShare,
      downloadItem,
      copySecret,
      router,
      // shareRefContent,
      showShareDialog,
      shareRefContent,
      visible,
      proxy,
      copyContent,
      deviceData,
      email,
      beforeClose,
      ipfsPin,
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
