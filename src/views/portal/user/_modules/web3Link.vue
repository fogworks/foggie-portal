<template>
  <div>
    <h1 class="title">
      <img style="width: 45px" src="@/assets/logo-dog-black.svg" alt="" />
      Foggie
    </h1>
    <div style="margin: 0 auto">
      <img style="height: 50px" src="@/assets/foggie.jpg" alt="" />
    </div>
    <h2 style="margin-bottom: 20px">
      Lightning fast reads from the IPFS network
    </h2>
    <p style="width: 900px; margin: 0 auto; font-size: 20px">
      Read data available on the public IPFS network with Foggie (at
      <a
        target="_blank"
        style="color: #2419d3"
        href="https://foggie.fogworks.io"
        >https://foggie.fogworks.io</a
      >),Add your content ID (CID) below to try it out.
    </p>
    <el-input
      :disabled="!hasLink"
      class="search-input"
      v-model="keyWord"
      placeholder="cid..."
    >
      <template #prepend>
        <el-select
          :disabled="!hasLink"
          v-model="checked"
          placeholder="Select"
          style="width: 115px"
        >
          <el-option label="ipfs://" value="ipfs" />
          <el-option label="foggie://" value="foggie" />
        </el-select>
      </template>
      <template #suffix>
        <el-button :disabled="!hasLink" type="primary" @click="downloadItem"
          >GO</el-button
        >
      </template>
    </el-input>
    <div class="dir-div">
      <div v-for="item in pin_arr.list">
        <p>
          <span class="span1">Name: </span>
          <span class="span2">{{ item.name }}</span>
          <a @click="next_download(item)">GO</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
import { search_object } from "@/utils/api.js";
import useOrderList from "@/views/portal/_modules/hooks/useOrderList";
import { useStore } from "vuex";

const keyWord = ref("");
const cur_item = ref({});
const { proxy } = getCurrentInstance();
const checked = ref("ipfs");
const { list, search } = useOrderList();
const store = useStore();
const hasLink = computed(() => {
  return list.value.some(
    (el) =>
      el.device_type == "" ||
      el.device_type == "foggie_max" ||
      el.device_type == "foggie"
  );
});

const foggieList = computed(() => {
  let list = store.getters["global/deviceList"];
  // return list
});
let pin_arr = reactive({
  lsit: [],
});
const isShow = false;
const downloadItem = () => {
  if (!isShow) {
    return;
  }
  let cid = keyWord.value;
  // test Qmay112YzDqKkRWZKh8dChv32Fifcz4L7kWmTXZ2GAixLo
  if (cid) {
    let key = "";

    let ip1 = "154.37.18.168";
    let ip2 = "154.37.19.182";
    // let ip = "154.31.34.194";
    let port = 6007;
    // let Id = orderId.value;
    let id1 = "baeqacmjq";
    let id2 = 36;
    let peerId = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";
    let token = store.getters.token;
    let data1 = {
      cid,
      key,
      Id: id1,
      peerId,
      ip: ip1,
      port,
      token,
    };
    let data2 = {
      cid,
      key,
      Id: id2,
      peerId,
      ip: ip2,
      port,
      token,
    };
    pin_arr.list = [];
    search_object(data1).then(async (r) => {
      if (r.links) {
        pin_arr.list = r.links;
        let k = keyWord.value;
        pin_arr.list.filter((n) => {
          let len = n.name.indexOf(`${k}/`);
          if (len > -1) {
            n.name = n.name.substr(n.name.indexOf("/"));
          }
        });
      } else {
        // let type = r.type;

        // const url = window.URL.createObjectURL(new Blob([r]));
        let token = store.getters.token;

        let downloadUrl = `/file_download/?cid=${cid}&key=${key}&ip=${ip1}&port=${port}&Id=${id1}&peerId=${peerId}&type=foggie&token=${token}`;

        const link = document.createElement("a");
        link.style.display = "none";
        link.href = downloadUrl;
        link.setAttribute("download", "apple.jpg");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // var oA = document.createElement("a");
        // oA.download = '';
        // oA.href = r;
        // document.body.appendChild(oA);
        // oA.click();
        // oA.remove();
        proxy.$notify({
          type: "success",
          message: "Downloading",
          position: "bottom-left",
        });
      }
      // if (pin_arr.length === 0 && r.length === 2) {
      //   pin_arr = r;
      //   download(r);
      // }
    });
    // search_object(data2).then((rr) => {
    //   console.log("++++++++++++data2", rr);
    //   if (pin_arr.length === 0 && rr.length === 2) {
    //     pin_arr = rr;
    //     download(rr);
    //   }
    // });
  }
  const download = (data) => {
    if (typeof r === "sring") {
    }

    // let links = data[1].links;
  };
};
const next_download = (item) => {
  console.log(1111, item);
  keyWord.value = item.hash;
  cur_item.value = item;
  downloadItem();
};
onMounted(search);
</script>

<style lang="scss" scoped>
.title {
}
.search-input {
  width: 900px;
  margin-top: 50px;
  :deep {
    .el-input-group__prepend {
      border-radius: 50px 0 0 50px;
      background: linear-gradient(120deg, #3913b8 0%, #75e0e6 100%);
      color: #fff;
      box-shadow: none;
      .el-input__inner {
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
      .el-input__suffix {
        .el-icon {
          color: #fff;
        }
      }
    }
    > .el-input__wrapper {
      .el-input__inner {
        color: #000;
      }
    }
  }
  .el-button {
    width: unset;
    height: 35px;
    border-radius: 99px;
  }
}
.dir-div {
  margin: 0 auto;
  width: 900px;
  p {
    height: 40px;
    line-height: 40px;
    text-align: left;
    .span1 {
      width: 100px;
      display: inline-block;
      padding-left: 20px;
    }
    .span2 {
      width: 600px;
      display: inline-block;
      padding-left: 20px;
    }
  }
}
</style>
