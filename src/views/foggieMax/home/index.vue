<template>
  <div class="top-between" v-if="haveNet">
    <MyAssets :currentOODItem="currentOODItem.data"></MyAssets>
    <DashBoard :currentOODItem="currentOODItem.data"></DashBoard>
  </div>
  <!-- v-if="currentOODItem.data.device_id" -->
  <MyFiles
    ref="myFile"
    :currentOODItem="currentOODItem.data"
    @toggleToUpload="toggleToUpload"
    @currentPrefix="currentPrefix"
  ></MyFiles>
  <top-upload
    v-show="showTopUpload"
    @closeUploadBox="closeUploadBox"
    :currentOODItem="currentOODItem"
    :oodId="oodId"
    :currentPath="currentPath"
    @fileShare="showShareBox"
  ></top-upload>
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
import { ref, reactive, onMounted, computed, toRefs, inject } from "vue";
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
      console.log(oodData.result, "oodData.result");
      store.dispatch("global/setCurrentOODItem", {
        data: oodData.result,
      });
      // if (oodData && oodData.data && oodData.data.length > 0) {
      //   currentOODItem.value.data = oodData.data[0];
      // }
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
          await pIN(data);
        }
      }
      if (key) {
        let user = window.sessionStorage.getItem("walletUser");
        let ood_id = currentOODItem.value.data.device_id;
        let deceive_id_real = currentOODItem.value.data.device_id_real
          ? currentOODItem.value.data.device_id_real
          : currentOODItem.value.data.device_id;
        let _key = encodeURIComponent(key);
        let data = await shareLink(ood_id, _key);
        let meta = data.meta;

        let httpStr = `${location.origin}/fog/${meta.pubkey}`;
        let cyfsStr = `cyfs://o/${deceive_id_real}/${meta.file_id}`;
        let ipfsStr = `ipfs://${meta.cid}`;

        let shareTitle = "GO TO Share";
        let shareContent =
          "The more people visit your files, the more DMC you get, share it with more friends! Share information copied to clipboard!";
        let shareCopyContent = `${user} publish ${key} to Web3` + "\n";
        shareRefContent.user = `${user} publish ${key} to Web3`;

        let myQrcode = window.sessionStorage.getItem("myQrcode");
        let code = `http://foggie.fogworks.io/?pcode=${myQrcode}`;
        let shareStr = `"The Web3 content I publish with Foggie is my digital asset and cannot be tampered with or deleted without my permission. It can also help us earn $DMC crypto rewards. Let's Web3-to-Earn together! Use my invite link ${code} to adopt a Foggie so we can all earn $DMC and grow Web3 together.Thanks!"`;
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareCopyContent = shareCopyContent + httpStr + " \n";
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareRefContent.httpStr = httpStr;

        //  TODO
        if (item.isIPFS && meta.cid) {
          shareCopyContent = shareCopyContent + ipfsStr + " \n";
          shareCopyContent = shareCopyContent + " " + " \n ";
          shareRefContent.ipfsStr = ipfsStr;
          shareRefContent.httpStr =
            shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;
        }
        // TODO
        if (item.isCYFS && meta.file_id) {
          shareCopyContent = shareCopyContent + cyfsStr + " \n";
          shareCopyContent = shareCopyContent + " " + " \n ";
          shareRefContent.cyfsStr = cyfsStr;
          shareRefContent.httpStr =
            shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;
        }

        shareCopyContent = shareCopyContent + shareStr + " \n";
        copyContent.value = shareCopyContent;
        shareRefContent.shareStr = shareStr;

        console.log(
          "shareCopyContent",
          `${shareTitle} ${shareContent} ${shareCopyContent}`
        );
        showShareDialog.value = true;
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
