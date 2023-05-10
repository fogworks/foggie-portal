<template>
  <div class="card card-custom clearfix">
    <div class="card-header">
      <h3 style="display: flex; align-items: center">
        <div class="card-title">
          <span v-if="activeName == 'Challenge'">Challenge List</span>
          <span v-else-if="activeName == 'Arbitration'">Arbitration List</span>
          <span v-else>Merkle List</span>
          <span class="font-size-sm">
            <span>{{ data[activeName].total }} Record</span>
          </span>
        </div>
      </h3>
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
            <el-dropdown-item
              :command="{ flag: 'Arbitration', command: 'Arbitration' }"
              >Arbitration</el-dropdown-item
            >
            <el-dropdown-item :command="{ flag: 'Merkle', command: 'Merkle' }"
              >Merkle</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- <template v-if="activeName == 'Challenge'">
      <div class="card-body">
        <div class="timeline">
          <div
            class="timeline-item"
            v-for="item in data.Challenge.dataList"
            :key="item.id"
          >
            <div class="timeline-label">{{ item.createdAt }}</div>

            <div class="timeline-badge text-warning"></div>

            <div class="timeline-content text-muted fs16">
              {{ item.sender }}
              <span class="text-warning1 font-weight-bolder fs12">Waiting</span>
              <div style="padding: 10px">
                <span class="mr-20"> Merkle Root</span>
                <span>{{ item.Merkle_root }}</span>
              </div>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">
              2023-04-26 08:42
            </div>

            <div class="timeline-badge text-success"></div>

            <div class="timeline-content">
              <span class="font-weight-bolder">OrderID: 20</span>
              <span class="text-success1 font-weight-bolder fs12">Success</span>
              <div style="padding: 10px" class="font-weight-bolder">
                <span>提交人：张三</span>
                <p class="text-muted">
                  张三仲裁成功，由于你作恶，现扣除你押金
                  <span class="text-danger1 fs12">-50DMC</span>
                </p>
              </div>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">
              2023-04-26 08:42
            </div>

            <div class="timeline-badge text-danger"></div>

            <div class="timeline-content">
              <span class="font-weight-bolder">OrderID: 20 </span>
              <span class="text-danger1 font-weight-bolder fs13">Fail</span>
              <div style="padding: 10px" class="font-weight-bolder">
                <span>提交人：李四</span>

                <p class="text-muted">
                  李四仲裁失败，由于你挑战成功，现奖励你
                  <span class="text-success1 fs12">+500DMC</span>
                </p>
              </div>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">16:50</div>

            <div class="timeline-badge text-primary"></div>

            <div class="timeline-content text-muted">
              Indulging in poorly driving and keep structure keep great
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">21:03</div>

            <div class="timeline-badge text-danger"></div>

            <div class="timeline-content font-weight-bolder">
              New order placed <a href="#" class="text-primary1">#XF-2356</a>.
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">23:07</div>

            <div class="timeline-badge text-info"></div>

            <div class="timeline-content font-weight-mormal">
              Outlines keep and you honest. Indulging in poorly driving
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">16:50</div>

            <div class="timeline-badge text-primary"></div>

            <div class="timeline-content text-muted">
              Indulging in poorly driving and keep structure keep great
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">21:03</div>

            <div class="timeline-badge text-danger"></div>

            <div class="timeline-content font-weight-bolder">
              New order placed <a href="#" class="text-primary1">#XF-2356</a>.
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="activeName == 'Arbitration'">
      <div class="card-body">
        <div class="timeline">
          <div
            class="timeline-item"
            v-for="item in data.Arbitration.dataList"
            :key="item.id"
          >
            <div class="timeline-label">{{ item.createdAt }}</div>

            <div class="timeline-badge text-warning"></div>

            <div class="timeline-content text-muted fs16">
              {{ item.sender }}
              <span class="text-warning1 font-weight-bolder fs12">Waiting</span>
              <div style="padding: 10px">
                <span class="mr-20"> Merkle Root</span>
                <span>{{ item.Merkle_root }}</span>
              </div>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">
              2023-04-26 08:42
            </div>

            <div class="timeline-badge text-success"></div>

            <div class="timeline-content">
              <span class="font-weight-bolder">OrderID: 20</span>
              <span class="text-success1 font-weight-bolder fs12">Success</span>
              <div style="padding: 10px" class="font-weight-bolder">
                <span>提交人：张三</span>
                <p class="text-muted">
                  张三仲裁成功，由于你作恶，现扣除你押金
                  <span class="text-danger1 fs12">-50DMC</span>
                </p>
              </div>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">
              2023-04-26 08:42
            </div>

            <div class="timeline-badge text-danger"></div>

            <div class="timeline-content">
              <span class="font-weight-bolder">OrderID: 20 </span>
              <span class="text-danger1 font-weight-bolder fs13">Fail</span>
              <div style="padding: 10px" class="font-weight-bolder">
                <span>提交人：李四</span>

                <p class="text-muted">
                  李四仲裁失败，由于你挑战成功，现奖励你
                  <span class="text-success1 fs12">+500DMC</span>
                </p>
              </div>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">16:50</div>

            <div class="timeline-badge text-primary"></div>

            <div class="timeline-content text-muted">
              Indulging in poorly driving and keep structure keep great
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">21:03</div>

            <div class="timeline-badge text-danger"></div>

            <div class="timeline-content font-weight-bolder">
              New order placed <a href="#" class="text-primary1">#XF-2356</a>.
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">23:07</div>

            <div class="timeline-badge text-info"></div>

            <div class="timeline-content font-weight-mormal">
              Outlines keep and you honest. Indulging in poorly driving
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">16:50</div>

            <div class="timeline-badge text-primary"></div>

            <div class="timeline-content text-muted">
              Indulging in poorly driving and keep structure keep great
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-label font-weight-bolder">21:03</div>

            <div class="timeline-badge text-danger"></div>

            <div class="timeline-content font-weight-bolder">
              New order placed <a href="#" class="text-primary1">#XF-2356</a>.
            </div>
          </div>
        </div>
      </div>
    </template> -->

    <div
      class="card-body"
      v-infinite-scroll="dataListInfinite"
      :infinite-scroll-immediate="true"
      :infinite-scroll-distance="150"
    >
      <div class="timeline">
        <div
          class="timeline-item"
          v-for="item in data[activeName].dataList"
          :key="item.data_id"
        >
          <div class="timeline-label font-weight-bolder">
            {{ item.createdAt }}
          </div>

          <div
            class="timeline-badge"
            :class="item.state == 'success' ? 'text-success' : 'text-danger'"
          ></div>

          <div class="timeline-content">
            <span class="font-weight-bolder">{{ item.sender }}</span>
            <span
              class="font-weight-bolder fs12 ml-8"
              :class="
                item.state == 'success' ? 'text-success1' : 'text-danger1'
              "
              >{{ item.state == "success" ? "Success" : "Fail" }}</span
            >
            <div style="padding: 10px" class="font-weight-bolder">
              <span
                class="mr-20"
                :class="
                  item.state == 'success' ? 'text-primary1' : 'text-danger1'
                "
                >{{
                  activeName == "Merkle" ? "Merkle Root #" : "Reply Hash #"
                }}</span
              >
              <span
                class="fs12"
                :class="
                  item.state == 'success' ? 'text-success1' : 'text-muted'
                "
                >{{ item.merkle_root || item.hash_data }}</span
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
import {
  getMerkleList,
  getChallengeList,
  getArbitrationList,
} from "@/api/order/orderList.js";

const store = useStore();
const email = computed(() => store.getters["token/currentUser"]);

const props = defineProps({
  orderId: {
    type: [String, Number],
  },
});
const { orderId } = toRefs(props);
const activeName = ref("Challenge");
const data = reactive({
  Challenge: {
    total: 0,
    pageSizes: 10,
    pageNum: 1,
    dataList: [],
  },
  Arbitration: {
    total: 0,
    pageSizes: 10,
    pageNum: 1,
    dataList: [],
  },
  Merkle: {
    total: 0,
    pageSizes: 10,
    pageNum: 1,
    dataList: [],
  },
});

/* 挑战 */
function loadChallengeList() {
  let params = {
    orderId: orderId.value,
    pageSize: data.Challenge.pageSizes,
    pageNo: data.Challenge.pageNum,
  };
  getChallengeList(params)
    .then((res) => {
      if (res.code == 200) {
        data.Challenge.total = res.data.count;
        for (const item of res.data.list) {
          item.createdAt = ChinaTime1(item.created_time);
        }
        data.Challenge.dataList = data.Challenge.dataList.concat(res.data.list);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
/* markle 记录 */
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
        data.Merkle.total = res.result.total;
        for (const item of res.result.data) {
          item.createdAt = ChinaTime1(item.createdAt);
        }
        data.Merkle.dataList = data.Merkle.dataList.concat(res.result.data);
        console.log(data.Merkle.dataList);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
/* 仲裁 记录 */
function loadArbitration() {
  let params = {
    email: email.value,
    orderId: orderId.value,
    pageSize: data.Arbitration.pageSizes,
    pageNo: data.Arbitration.pageNum,
  };
  getArbitrationList(params)
    .then((res) => {
      if (res.code == 200) {
        data.Challenge.total = res.result.total;
        for (const item of res.data) {
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

/* 下拉加载 */
function dataListInfinite() {
  if (data[activeName.value].total > data[activeName.value].dataList.length) {
    data[activeName.value].pageNum += 1;
    switch (activeName.value) {
      case "Challenge":
        loadChallengeList();
        break;

      case "Arbitration":
        loadArbitration();
        break;
      case "Merkle":
        loadMerkleList();
        break;
    }
  } else {
    return;
  }
}
const handleCommand = (item) => {
  activeName.value = item.flag;
};
onMounted(() => {
  loadChallengeList();
});

watch(
  () => activeName,
  (newVal) => {
    data[newVal].pageNum = 1;
    data[newVal].dataList = [];
    if (newVal == "Challenge") {
      loadChallengeList();
    } else if (newVal == "Arbitration") {
      loadArbitration();
    } else if (newVal == "Merkle") {
      loadMerkleList();
    }
  }
);
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
  box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(190, 190, 190),
    0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  height: 400px;
  overflow-y: auto;
  width: 100%;
  max-width: 1960px;
  margin: 0px auto;
  margin-top: 20px;
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

  .card-title {
    font-weight: 600;
    font-size: 20px;
    color: #181c32;
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
        color: #3f4254 !important;
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
        color: #3f4254 !important;
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
