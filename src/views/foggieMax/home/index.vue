<template>
  <div class="top-between" v-if="haveNet">
    <MyAssets :currentOODItem="currentOODItem.data"></MyAssets>
    <DashBoard :currentOODItem="currentOODItem.data"></DashBoard>
  </div>
  <!-- v-if="currentOODItem.data.device_id" -->
  <MyFiles
    ref="myFile"
    :currentOODItem="currentOODItem.data"
    :orderId="deviceData.order_id"
    @toggleToUpload="toggleToUpload"
    @currentPrefix="currentPrefix"
  ></MyFiles>
  <!-- <top-upload
    v-show="showTopUpload"
    @closeUploadBox="closeUploadBox"
    :currentOODItem="currentOODItem"
    :oodId="oodId"
    :currentPath="currentPath"
    @fileShare="showShareBox"
  ></top-upload> -->
  <ShareDialog
    v-model:visible="showShareDialog"
    :shareRefContent="shareRefContent"
    :copyContent="copyContent"
  ></ShareDialog>
</template>

<script>
import MyAssets from "./_modules/myAssets/myAssets";
import DashBoard from "./_modules/myAssets/dashBoard";
import MyFiles from "./_modules/myFiles";
import TopUpload from "@/components/upload/index";
import { shareLink, pIN, getActivationVood } from "@/utils/api.js";
import {
  ref,
  reactive,
  onMounted,
  computed,
  provide,
  toRefs,
  inject,
} from "vue";
import ShareDialog from "./_modules/myFiles/shareDialog";
import { ElNotification } from "element-plus";
import { useStore } from "vuex";
export default {
  name: "Layout",
  props: {
    haveNet: {
      type: Boolean,
      default: false,
    },
    deviceData: {
      type: Object,
      default: {},
    },
  },
  components: {
    MyAssets,
    DashBoard,
    MyFiles,
    TopUpload,
    ShareDialog,
  },
  setup(props) {
    const { haveNet, deviceData } = toRefs(props);
    const showShareDialog = ref(false);
    const shareRefContent = reactive({});
    const currentPath = ref("");
    const store = useStore();
    const currentOODItem = ref({
      data: {
        device_id: "",
      },
    });
    provide("currentOODItem", currentOODItem);

    const myFile = ref(null);
    const closeUploadBox = () => {
      showTopUpload.value = false;
      myFile.value.doSearch();
    };
    const showTopUpload = ref(false);
    const requestTarget = inject("requestTarget");
    const initFoggieDate = async () => {
      // get is have net

      let data = {
        pn: 1,
        ps: 50,
      };
      let oodData = await getActivationVood(data, requestTarget);
      currentOODItem.value.data = oodData.result;
    };
    onMounted(() => {
      initFoggieDate();
    });
    const toggleToUpload = () => {
      showTopUpload.value = !showTopUpload.value;
    };
    const currentPrefix = (prefix) => {
      currentPath.value = `${prefix.join("/")}/`;
    };
    const copyContent = ref("");
    const showShareBox = async (item) => {
      if (!item.pubkey) {
        ElNotification({
          type: "info",
          message: "This file cannot be shared",
          position: "bottom-left",
        });
        return false;
      }
      let key = "";
      if (item) {
        key = item.name;
        let ood_id = currentOODItem.value.data.device_id;
        let data = {
          key: item.pubkey,
          is_pin: false,
          new_path: item.name,
        };
        if (item.isIPFS) {
          // await pIN(data);
        }
      }

      if (key) {
        let user = store.getters["global/userInfo"].dmc;
        let ood_id_cyfs = device_id_real ? device_id_real : device_id;
        let peer_id = deviceData.value.peer_id;
        let httpStr = `foggie://${peer_id}/${orderId.value}/${item.cid}`;
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
        shareRefContent.httpStr = httpStr;
        shareCopyContent = shareCopyContent + ipfsStr + " \n";
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareRefContent.ipfsStr = ipfsStr;
        shareRefContent.httpStr =
          shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;

        shareCopyContent = shareCopyContent + cyfsStr + " \n";
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareRefContent.cyfsStr = cyfsStr;
        shareRefContent.httpStr =
          shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;

        shareCopyContent = shareCopyContent + shareStr + " \n";
        shareRefContent.shareStr = shareStr;
        copyContent.value = shareCopyContent;
        // shareRefContent.value=shareCopyContent
        showShareDialog.value = true;
        // this.shareBoxShow = true;
      }
    };
    return {
      currentOODItem,
      showTopUpload,
      currentPath,
      myFile,
      haveNet,
      closeUploadBox,
      toggleToUpload,
      currentPrefix,
      showShareBox,
      showShareDialog,
      shareRefContent,
      copyContent,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
  box-sizing: border-box;
  main {
    z-index: 1;
  }
}
.top-between {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}
</style>
