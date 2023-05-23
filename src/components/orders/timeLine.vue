<template>
  <div class="card card-custom clearfix">
    <div class="card-header">
      <h3 style="display: flex; align-items: center">
        <div class="card-title">
          <span v-if="activeName == 'Challenge'">Challenge List</span>
          <span v-else>Merkle List</span>
          <span class="font-size-sm">
            <span>{{ data[activeName].total }} Record</span>
          </span>
        </div>
      </h3>
      <div style="display: flex; align-items: center">
        <el-dropdown
          trigger="click"
          @command="handleCommand"
          popper-class="custom_dropdown"
        >
          <div class="color-box">
            <img src="@/assets/more.svg" alt="" />
          </div>
          <template #dropdown>
            <el-dropdown-menu class="more-dropdown" slot="dropdown">
              <el-dropdown-item
                :command="{ flag: 'Challenge', command: 'Challenge' }"
                >Challenge</el-dropdown-item
              >
              <el-dropdown-item :command="{ flag: 'Merkle', command: 'Merkle' }"
                >Merkle</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div
      class="card-body"
      v-infinite-scroll="dataListInfinite"
      :infinite-scroll-immediate="false"
      :infinite-scroll-distance="150"
    >
      <div class="timeline">
        <div
          class="timeline-item"
          v-for="item in data[activeName].dataList"
          :key="item.data_id || item.order_id"
        >
          <div class="timeline-label font-weight-bolder">
            {{ item.createdAt }}
          </div>

          <div
            class="timeline-badge"
            :class="
              item.state == 'success'
                ? 'text-success'
                : item.state == 'error'
                ? 'text-danger'
                : 'normal'
            "
          ></div>

          <div class="timeline-content" style="text-align: left">
            <span
              class="font-weight-bolder"
              v-if="item.challenger && item.challenger.id"
              >{{ item.challenger.id }}</span
            >
            <span
              class="font-weight-bolder fs12 ml-8"
              :class="
                item.state == 'success'
                  ? 'text-success1'
                  : item.state == 'error'
                  ? 'text-danger1'
                  : 'normal'
              "
              >{{ item.stateTitle || "" }}</span
            >
            <div style="padding: 10px" class="font-weight-bolder">
              <span
                class="mr-20"
                :class="
                  item.state == 'success'
                    ? 'text-primary1'
                    : item.state == 'error'
                    ? 'text-danger1'
                    : 'normal'
                "
                >{{
                  activeName == "Merkle" ? "Merkle Root #" : "Data Hash #"
                }}</span
              >
              <span
                class="fs12"
                :class="
                  item.state == 'success'
                    ? 'text-success1'
                    : item.state == 'error'
                    ? 'text-muted'
                    : 'normal'
                "
                >{{
                  activeName == "Merkle" ? item.merkle_root : item.data_hash
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  transferTime,
  ChinaTime1,
  transferISOTime,
} from "@/utils/ChinaStandardTime.js";
import { transferUTCTime } from "@/utils/util";
import {
  ref,
  reactive,
  onMounted,
  toRefs,
  computed,
  defineProps,
  watch,
} from "vue";

import { useStore } from "vuex";
import { getMerkleList, getChallengeList } from "@/api/order/orderList.js";

const store = useStore();
const email = computed(() => store.getters["token/currentUser"]);

const props = defineProps({
  orderId: {
    type: [String, Number],
  },
});
const { orderId } = toRefs(props);
const activeName = ref("Challenge");
const isCollapse = ref(false);
const data = reactive({
  Challenge: {
    total: 0,
    pageSizes: 10,
    pageNum: 1,
    dataList: [],
  },
  // Arbitration: {
  //   total: 0,
  //   pageSizes: 10,
  //   pageNum: 1,
  //   dataList: [],
  // },
  Merkle: {
    total: 0,
    pageSizes: 10,
    pageNum: 1,
    dataList: [],
  },
});

function loadChallengeList() {
  let params = {
    email: email.value,
    orderId: orderId.value,
    pageSize: data.Challenge.pageSizes,
    pageNo: data.Challenge.pageNum,
  };
  getChallengeList(params)
    .then((res) => {
      if (res.code == 200) {
        data.Challenge.total = res.data.count;
        for (const item of res.data.list) {
          // item.createdAt = transferUTCTime(item.create_time);
          item.createdAt = item.create_time;
          if (item.state == 3) {
            item.state = "";
            item.stateTitle = "Challenging";
          } else if (item.state == 4) {
            item.state = "";
            item.stateTitle = "Miner has responded";
          } else if (item.state == 5) {
            item.state = "success";
            item.stateTitle = "Success";
          } else if (item.state == 6) {
            item.state = "error";
            item.stateTitle = "Fail";
          } else if (item.state == 7) {
            item.state = "error";
            item.stateTitle = "Challenge timeout";
          }
        }
        data.Challenge.dataList = data.Challenge.dataList.concat(res.data.list);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
function loadMerkleList() {
  let params = {
    email: email.value,
    orderId: orderId.value,
    pageSize: data.Merkle.pageSizes,
    pageNo: data.Merkle.pageNum,
  };
  getMerkleList(params)
    .then((res) => {
      if (res.code == 200) {
        data.Merkle.total = res.data.count;
        for (const item of res.data.list) {
          // item.createdAt = transferUTCTime(item.create_time);
          item.createdAt = item.create_time;
          item.state = "success";
        }
        data.Merkle.dataList = data.Merkle.dataList.concat(res.data.list);
        console.log(data.Merkle.dataList);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function dataListInfinite() {
  console.log(789);
  if (data[activeName.value].total > data[activeName.value].dataList.length) {
    data[activeName.value].pageNum += 1;
    switch (activeName.value) {
      case "Challenge":
        loadChallengeList();
        break;
      case "Merkle":
        loadMerkleList();
        break;
    }
  } else {
    return;
  }
}

watch(
  () => activeName.value,
  (newVal) => {
    data[newVal].pageNum = 1;
    data[newVal].dataList = [];
    if (newVal == "Challenge") {
      loadChallengeList();
    } else if (newVal == "Merkle") {
      loadMerkleList();
    }
  }
);
const handleCommand = (item) => {
  activeName.value = item.flag;
  console.log(activeName.value);
};
onMounted(() => {
  loadChallengeList();
});
defineExpose({
  loadChallengeList,
  loadMerkleList,
});
</script>

<style lang="scss" scoped>
.Back {
  width: 100px;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 40px;
}

.Back::after {
  content: "";
  display: inline-block;
  position: absolute;
  right: 0px;
  top: -3px;
  width: 1px;
  height: 30px;
  background: #3f4254;
}

.card {
  background-color: var(--bg-color);
  transition: border-radius 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 10px;
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
  max-width: 1960px;
  margin: 0px auto;
  margin-top: 20px;

  transition: height 0.4s;
}

.card::-webkit-scrollbar {
  display: none;
}

.cardHide {
  overflow: hidden;
  height: 60px;
}

.card.card-custom > .card-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;

  -ms-flex-wrap: wrap;
  flex-wrap: wrap;

  padding-top: 0;
  padding-bottom: 0;
}

.card-header {
  padding: 2rem 2.25rem;
  margin-bottom: 0;
  background-color: var(--bg-color);
  border-bottom: 0.5px solid #ebedf3;
  align-items: center;
  position: sticky;
  top: 0px;

  z-index: 999;
  .color-box {
    // @include color-box;
    cursor: pointer;
    svg {
      color: $light_blue;
      font-size: 28px;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }

    &:hover {
      svg {
        transform: scale(1.1);
      }
    }
  }

  .card-title {
    font-weight: 600;
    font-size: 20px;
    color: var(--text-color);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    align-items: start;
    margin: 0.5rem;
    margin-left: 0;
  }
}

.card-header:first-child {
  border-radius: calc(0.42rem - 1px) calc(0.42rem - 1px) 0 0;
}

.card-body {
  position: relative;
  z-index: 0;
  padding: 16px;
}

.font-size-sm {
  font-size: 13px;
  color: #acacb4 !important;
  font-weight: 500 !important;
  margin-top: 5px;
  margin-left: 15px;
}

.card-body {
  padding: 32px 40px;

  .timeline {
    margin-top: 12px;
    position: relative;

    .timeline-item {
      display: flex;
      position: relative;

      margin-bottom: 20px;

      .timeline-label {
        width: 150px;
        flex-shrink: 0;
        font-size: 13px;
        color: var(--text-color) !important;
        position: relative;

        font-weight: 600 !important;
        box-sizing: border-box;
      }

      .timeline-badge {
        -ms-flex-negative: 0;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        border-radius: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        margin-top: 0px;
        position: relative;

        margin-left: -6px;
        padding: 3px !important;
        border: 1px solid var(--bg-color) !important;
      }

      .timeline-content {
        padding-left: 10px;
        font-size: 14px;
        color: var(--text-color-777) !important;
      }

      .timeline-badge::before {
        position: absolute;
        display: inline-block;
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #ffffff;
      }

      .text-warning1 {
        color: #ffa800 !important;
        font-style: italic;
      }

      .text-warning {
        background-color: #ffa800 !important;
      }

      .text-success1 {
        color: #1bc5bd !important;
        font-style: italic;
      }

      .text-success {
        background-color: #1bc5bd !important;
      }

      .text-primary1 {
        color: #0bb783 !important;
        font-style: italic;
      }

      .text-primary {
        background-color: #0bb783 !important;
      }

      .text-danger1 {
        color: #f64e60 !important;
        font-style: italic;
      }

      .text-danger {
        background-color: #f64e60 !important;
      }

      .text-info {
        background-color: #8950fc !important;
      }

      .text-muted {
        color: #b5b5c3 !important;
      }

      .font-weight-bolder {
        font-weight: 600 !important;
      }
    }
  }

  .timeline::before {
    content: "";
    position: absolute;
    left: 150px;
    width: 5px;
    top: 0;
    bottom: 0;
    background-color: #ebedf3;
  }
}
</style>
