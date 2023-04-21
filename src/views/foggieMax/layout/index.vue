<template>
  <div class="container">
    <!-- <header>
      <LayoutHeader></LayoutHeader>
    </header> -->
    <main>
      <Access v-if="!accessible" v-model:accessible="accessible"></Access>
      <div v-else>
        <div class="top-title">
          <span>
            {{ deviceData.data.device_name }}
          </span>
        </div>
        <MaxHome :haveNet="haveNet"></MaxHome>
      </div>
    </main>
    <!-- <footer>
      <LayoutFooter></LayoutFooter>
    </footer> -->
  </div>
</template>

<script>
// import LayoutHeader from "./layoutHeader";
// import LayoutFooter from "./layoutFooter";
import MaxHome from "../home";
import Access from "./access";
import { useStore } from "vuex";
// import mainVue from './views/main/main.vue'
import {
  shareLink,
  pIN,
  getActivationVood,
  detected_net,
} from "@/utils/api.js";
import { ref, onMounted, toRefs } from "vue";
export default {
  name: "FoggieMax",
  components: {
    MaxHome,
    Access,
    // LayoutHeader,
    // LayoutFooter,
  },
  props: {
    deviceData: { data: {} },
  },
  setup(props) {
    const { deviceData } = toRefs(props);
    const store = useStore();
    const accessible = ref(false);
    const currentOODItem = ref({
      data: {
        device_id: "",
      },
    });
    const closeUploadBox = () => {
      showTopUpload.value = false;
    };
    const haveNet = ref(false);
    const showTopUpload = ref(false);
    const initFoggieDate = async () => {
      detected_net().then((res) => {
        if (res.result.detected_net) {
          haveNet.value = true;
        } else {
          haveNet.value = true;
        }
      });
      let data = {
        pn: 1,
        ps: 50,
      };
      let oodData = await getActivationVood(data);
      currentOODItem.value.data = oodData.result;
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
    const showShareBox = async (item) => {
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
      // else if (this.UploadShowList.length) {
      //   key = this.UploadShowList[0].name;
      // }
      if (key) {
        let user = window.sessionStorage.getItem("walletUser");
        let ood_id = currentOODItem.value.data.device_id;
        let _key = encodeURIComponent(key);
        let data = await shareLink(ood_id, _key);
        let meta = data.meta;

        let httpStr = `${location.origin}/fog/${meta.pubkey}`;
        let cyfsStr = `cyfs://o/${ood_id}/${meta.file_id}`;
        let ipfsStr = `ipfs://${meta.cid}`;

        let shareTitle = "GO TO Share";
        let shareContent =
          "The more people visit your files, the more DMC you get, share it with more friends! Share information copied to clipboard!";
        let shareCopyContent = `${user} publish ${key} to Web3` + "\n";
        let myQrcode = window.sessionStorage.getItem("myQrcode");
        let code = `http://foggie.fogworks.io/?pcode=${myQrcode}`;
        let shareStr = `"The Web3 content I publish with Foggie is my digital asset and cannot be tampered with or deleted without my permission. It can also help us earn $DMC crypto rewards. Let's Web3-to-Earn together! Use my invite link ${code} to adopt a Foggie so we can all earn $DMC and grow Web3 together.Thanks!"`;
        shareCopyContent = shareCopyContent + " " + " \n ";
        shareCopyContent = shareCopyContent + httpStr + " \n";
        shareCopyContent = shareCopyContent + " " + " \n ";
        //  TODO
        if (item.isIPFS && meta.cid) {
          shareCopyContent = shareCopyContent + ipfsStr + " \n";
          shareCopyContent = shareCopyContent + " " + " \n ";
        }
        // TODO
        if (item.isCYFS && meta.file_id) {
          shareCopyContent = shareCopyContent + cyfsStr + " \n";
          shareCopyContent = shareCopyContent + " " + " \n ";
        }

        shareCopyContent = shareCopyContent + shareStr + " \n";
        console.log(
          "shareCopyContent",
          `${shareTitle} ${shareContent} ${shareCopyContent}`
        );
      }
    };
    return {
      currentOODItem,
      showTopUpload,
      haveNet,
      accessible,
      deviceData,
      closeUploadBox,
      toggleToUpload,
      showShareBox,
    };
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
  box-sizing: border-box;
  main {
    z-index: 1;
  }
  .top-title {
    margin: 20px;
    font-size: 30px;
    text-align: left;
    font-weight: 700;
    text-align: left;
    span {
      background: linear-gradient(to right, #3913b8 0%, #75e0e6 100%);
      background-clip: text;
      text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.top-between {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}
</style>
